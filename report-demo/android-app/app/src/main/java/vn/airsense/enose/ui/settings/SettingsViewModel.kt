package vn.airsense.enose.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import vn.airsense.enose.data.repo.ConfigRepository
import vn.airsense.enose.data.repo.EnoseRepository
import vn.airsense.enose.ui.common.userMessageFromError
import javax.inject.Inject

data class SettingsState(
    val baseUrl: String = "",
    val apiKey: String = "",
    val refreshMs: Long = 10_000L,
    val testing: Boolean = false,
    val message: String? = null,
    val ok: Boolean? = null,
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val config: ConfigRepository,
    private val repo: EnoseRepository,
) : ViewModel() {
    private val _state = MutableStateFlow(SettingsState())
    val state: StateFlow<SettingsState> = _state

    init {
        viewModelScope.launch {
            _state.value = _state.value.copy(
                baseUrl = config.baseUrl.first(),
                apiKey = config.apiKey.first(),
                refreshMs = config.refreshMs.first(),
            )
        }
    }

    fun onBaseUrlChange(v: String) { _state.value = _state.value.copy(baseUrl = v) }
    fun onApiKeyChange(v: String) { _state.value = _state.value.copy(apiKey = v) }
    fun onRefreshMsChange(v: Long) { _state.value = _state.value.copy(refreshMs = v) }

    fun save() = viewModelScope.launch {
        config.setBaseUrl(_state.value.baseUrl)
        config.setApiKey(_state.value.apiKey)
        config.setRefreshMs(_state.value.refreshMs)
        _state.value = _state.value.copy(message = "Đã lưu cấu hình.", ok = true)
    }

    fun testConnection() = viewModelScope.launch {
        save()
        _state.value = _state.value.copy(testing = true, message = null, ok = null)
        try {
            val h = repo.health()
            val txt = "Kết nối OK • mongo=${h.mongo} • pg=${h.pg} • mqtt=${h.mqtt}"
            _state.value = _state.value.copy(testing = false, message = txt, ok = h.ok)
        } catch (e: Throwable) {
            _state.value = _state.value.copy(testing = false, message = userMessageFromError(e), ok = false)
        }
    }
}
