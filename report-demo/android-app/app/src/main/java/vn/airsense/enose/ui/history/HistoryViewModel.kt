package vn.airsense.enose.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import vn.airsense.enose.data.remote.dto.SensorDoc
import vn.airsense.enose.data.repo.ConfigRepository
import vn.airsense.enose.data.repo.EnoseRepository
import vn.airsense.enose.ui.common.userMessageFromError
import javax.inject.Inject

data class HistoryState(
    val loading: Boolean = true,
    val errorMsg: String? = null,
    val rows: List<SensorDoc> = emptyList(),
)

@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val repo: EnoseRepository,
    private val config: ConfigRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(HistoryState())
    val state: StateFlow<HistoryState> = _state

    init { reload() }

    fun reload() = viewModelScope.launch {
        try {
            val id = config.selectedDevice.first().ifBlank {
                repo.devices().firstOrNull()?.deviceCode.orEmpty()
            }
            if (id.isBlank()) {
                _state.value = HistoryState(loading = false, errorMsg = "Chưa có thiết bị.")
                return@launch
            }
            val list = repo.history(id, 120)
            _state.value = HistoryState(loading = false, rows = list)
        } catch (e: Throwable) {
            _state.value = HistoryState(loading = false, errorMsg = userMessageFromError(e))
        }
    }
}
