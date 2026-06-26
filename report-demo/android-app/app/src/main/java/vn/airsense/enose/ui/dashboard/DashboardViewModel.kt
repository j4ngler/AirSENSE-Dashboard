package vn.airsense.enose.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import vn.airsense.enose.data.remote.dto.*
import vn.airsense.enose.data.repo.ConfigRepository
import vn.airsense.enose.data.repo.EnoseRepository
import vn.airsense.enose.ui.common.userMessageFromError
import javax.inject.Inject

data class DashboardState(
    val loading: Boolean = true,
    val errorMsg: String? = null,

    val deviceCode: String = "",
    val devices: List<DeviceDto> = emptyList(),

    val latest: SensorDoc? = null,
    val status: DeviceStatusDto? = null,
    val active: ActiveMeasurementResponse? = null,
    val control: ControlStatusDto? = null,

    val heatingPending: Boolean? = null,
    val pumpPending: Boolean? = null,
    val pendingUntilMs: Long = 0,
)

/** Khóa nhãn ADC chuẩn (theo backend mqttBridge.js & report.js). */
val ADC_LABELS = listOf("EtOH1", "EtOH2", "EtOH3", "EtOH4", "EtOH5", "EtOH6", "VOC1", "VOC2")

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repo: EnoseRepository,
    private val config: ConfigRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(DashboardState())
    val state: StateFlow<DashboardState> = _state
    private var pollingJob: Job? = null

    init {
        viewModelScope.launch {
            val saved = config.selectedDevice.first()
            if (saved.isNotBlank()) _state.value = _state.value.copy(deviceCode = saved)
            startPolling()
        }
    }

    fun startPolling() {
        pollingJob?.cancel()
        pollingJob = viewModelScope.launch {
            while (true) {
                refreshOnce()
                delay(config.refreshMs.first())
            }
        }
    }

    fun refreshNow() = viewModelScope.launch { refreshOnce() }

    private suspend fun refreshOnce() {
        try {
            val devices = repo.devices()
            val chosen = _state.value.deviceCode.ifBlank { devices.firstOrNull()?.deviceCode.orEmpty() }
            if (chosen.isBlank()) {
                _state.value = _state.value.copy(loading = false, devices = devices, errorMsg = "Chưa có thiết bị trong database.")
                return
            }
            config.setSelectedDevice(chosen)

            val latest = runCatching { repo.latest(chosen) }.getOrNull()
            val status = runCatching { repo.status(chosen) }.getOrNull()
            val active = runCatching { repo.activeMeasurement(chosen) }.getOrNull()
            val control = runCatching { repo.controlStatus() }.getOrNull()

            _state.value = _state.value.copy(
                loading = false,
                errorMsg = null,
                devices = devices,
                deviceCode = chosen,
                latest = latest,
                status = status,
                active = active,
                control = control,
            ).clearStaleOptimism()
        } catch (e: Throwable) {
            _state.value = _state.value.copy(loading = false, errorMsg = userMessageFromError(e))
        }
    }

    /** Optimistic 25s như web (xem armSwitchOptimism trong report.js). */
    fun setHeating(on: Boolean) = viewModelScope.launch {
        val id = _state.value.deviceCode
        if (id.isBlank()) return@launch
        _state.value = _state.value.copy(
            heatingPending = on,
            pendingUntilMs = System.currentTimeMillis() + 25_000L
        )
        runCatching { repo.setHeating(id, on) }.onFailure { e ->
            _state.value = _state.value.copy(errorMsg = userMessageFromError(e), heatingPending = null)
        }
    }

    fun setPump(on: Boolean) = viewModelScope.launch {
        val id = _state.value.deviceCode
        if (id.isBlank()) return@launch
        _state.value = _state.value.copy(
            pumpPending = on,
            pendingUntilMs = System.currentTimeMillis() + 25_000L
        )
        runCatching { repo.setAirPump(id, on) }.onFailure { e ->
            _state.value = _state.value.copy(errorMsg = userMessageFromError(e), pumpPending = null)
        }
    }

    fun startMeasurement() = viewModelScope.launch {
        val id = _state.value.deviceCode
        if (id.isBlank()) return@launch
        runCatching { repo.start(id) }
            .onSuccess { refreshOnce() }
            .onFailure { _state.value = _state.value.copy(errorMsg = userMessageFromError(it)) }
    }

    fun stopMeasurement() = viewModelScope.launch {
        val id = _state.value.deviceCode
        if (id.isBlank()) return@launch
        runCatching { repo.stop(id) }
            .onSuccess { refreshOnce() }
            .onFailure { _state.value = _state.value.copy(errorMsg = userMessageFromError(it)) }
    }

    fun selectDevice(code: String) {
        _state.value = _state.value.copy(deviceCode = code, loading = true)
        viewModelScope.launch {
            config.setSelectedDevice(code)
            refreshOnce()
        }
    }

    private fun DashboardState.clearStaleOptimism(): DashboardState {
        if (System.currentTimeMillis() > pendingUntilMs) {
            return copy(heatingPending = null, pumpPending = null, pendingUntilMs = 0L)
        }
        val heat = status?.heatingEnabled == heatingPending
        val pump = status?.airPumpEnabled == pumpPending
        return copy(
            heatingPending = if (heat) null else heatingPending,
            pumpPending = if (pump) null else pumpPending,
        )
    }
}
