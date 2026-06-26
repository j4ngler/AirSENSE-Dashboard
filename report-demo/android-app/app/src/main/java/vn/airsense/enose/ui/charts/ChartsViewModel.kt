package vn.airsense.enose.ui.charts

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import vn.airsense.enose.data.remote.dto.SensorDoc
import vn.airsense.enose.data.repo.ConfigRepository
import vn.airsense.enose.data.repo.EnoseRepository
import vn.airsense.enose.ui.common.userMessageFromError
import vn.airsense.enose.ui.dashboard.ADC_LABELS
import javax.inject.Inject

data class ChartsState(
    val loading: Boolean = true,
    val errorMsg: String? = null,
    val points: List<SensorDoc> = emptyList(),
    val temp: List<Double> = emptyList(),
    val hum: List<Double> = emptyList(),
    val adc: Map<String, List<Double>> = emptyMap(),
    val timeAxis: List<Long> = emptyList(),
)

@HiltViewModel
class ChartsViewModel @Inject constructor(
    private val repo: EnoseRepository,
    private val config: ConfigRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(ChartsState())
    val state: StateFlow<ChartsState> = _state
    private var pollingJob: Job? = null

    init { start() }

    fun start() {
        pollingJob?.cancel()
        pollingJob = viewModelScope.launch {
            while (true) {
                loadOnce()
                delay(config.refreshMs.first())
            }
        }
    }

    fun refresh() = viewModelScope.launch { loadOnce() }

    private suspend fun loadOnce() {
        try {
            val id = config.selectedDevice.first().ifBlank {
                repo.devices().firstOrNull()?.deviceCode.orEmpty()
            }
            if (id.isBlank()) {
                _state.value = _state.value.copy(loading = false, errorMsg = "Chưa có thiết bị.")
                return
            }
            val list = repo.history(id, limit = 120).asReversed()
            val temp = list.mapNotNull { it.number("Temperature") ?: it.number("temperature") }
            val hum = list.mapNotNull { it.number("Humidity") ?: it.number("humidity") }
            val adc = mutableMapOf<String, List<Double>>()
            ADC_LABELS.forEachIndexed { idx, label ->
                adc[label] = list.map { doc ->
                    doc.number(label)
                        ?: doc.number("ADC$idx")
                        ?: doc.adcArray()?.getOrNull(idx)
                        ?: 0.0
                }
            }
            _state.value = _state.value.copy(
                loading = false,
                errorMsg = null,
                points = list,
                temp = temp,
                hum = hum,
                adc = adc,
                timeAxis = list.mapNotNull { it.time },
            )
        } catch (e: Throwable) {
            _state.value = _state.value.copy(loading = false, errorMsg = userMessageFromError(e))
        }
    }
}
