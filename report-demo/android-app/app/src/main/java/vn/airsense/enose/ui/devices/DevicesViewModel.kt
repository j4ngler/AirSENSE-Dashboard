package vn.airsense.enose.ui.devices

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import vn.airsense.enose.data.remote.dto.ChannelCreateBody
import vn.airsense.enose.data.remote.dto.ChannelDto
import vn.airsense.enose.data.remote.dto.ChannelUpdateBody
import vn.airsense.enose.data.repo.ConfigRepository
import vn.airsense.enose.data.repo.EnoseRepository
import vn.airsense.enose.ui.common.userMessageFromError
import javax.inject.Inject

data class DevicesState(
    val loading: Boolean = true,
    val errorMsg: String? = null,
    val infoMsg: String? = null,
    val deviceCode: String = "",
    val channels: List<ChannelDto> = emptyList(),
)

@HiltViewModel
class DevicesViewModel @Inject constructor(
    private val repo: EnoseRepository,
    private val config: ConfigRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(DevicesState())
    val state: StateFlow<DevicesState> = _state

    init { reload() }

    fun reload() = viewModelScope.launch {
        try {
            val id = config.selectedDevice.first().ifBlank {
                repo.devices().firstOrNull()?.deviceCode.orEmpty()
            }
            if (id.isBlank()) {
                _state.value = DevicesState(loading = false, errorMsg = "Chưa có thiết bị.")
                return@launch
            }
            val list = repo.channels(id)
            _state.value = DevicesState(loading = false, deviceCode = id, channels = list)
        } catch (e: Throwable) {
            _state.value = _state.value.copy(loading = false, errorMsg = userMessageFromError(e))
        }
    }

    fun add(channelIndex: Int, label: String, unit: String, sort: Int) = viewModelScope.launch {
        val id = _state.value.deviceCode
        if (id.isBlank()) return@launch
        try {
            repo.createChannel(id, ChannelCreateBody(channelIndex, label, unit, sort))
            _state.value = _state.value.copy(infoMsg = "Đã thêm kênh $label.")
            reload()
        } catch (e: Throwable) {
            _state.value = _state.value.copy(errorMsg = userMessageFromError(e))
        }
    }

    fun update(channel: ChannelDto, body: ChannelUpdateBody) = viewModelScope.launch {
        try {
            repo.updateChannel(channel.sensorChannelId, body)
            _state.value = _state.value.copy(infoMsg = "Đã cập nhật ${channel.label}.")
            reload()
        } catch (e: Throwable) {
            _state.value = _state.value.copy(errorMsg = userMessageFromError(e))
        }
    }

    fun delete(channel: ChannelDto) = viewModelScope.launch {
        try {
            repo.deleteChannel(channel.sensorChannelId)
            _state.value = _state.value.copy(infoMsg = "Đã xóa ${channel.label}.")
            reload()
        } catch (e: Throwable) {
            _state.value = _state.value.copy(errorMsg = userMessageFromError(e))
        }
    }

    fun clearMessages() {
        _state.value = _state.value.copy(errorMsg = null, infoMsg = null)
    }
}
