package vn.airsense.enose.data.repo

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "airsense_prefs")

@Singleton
class ConfigRepository @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val prefs = context.dataStore

    val baseUrl: Flow<String> = prefs.data.map { it[KEY_BASE_URL] ?: DEFAULT_BASE_URL }
    val apiKey: Flow<String> = prefs.data.map { it[KEY_API_KEY].orEmpty() }
    val refreshMs: Flow<Long> = prefs.data.map { it[KEY_REFRESH_MS] ?: 10_000L }
    val selectedDevice: Flow<String> = prefs.data.map { it[KEY_DEVICE].orEmpty() }

    suspend fun setBaseUrl(value: String) {
        val normalized = value.trim().trimEnd('/')
        prefs.edit { it[KEY_BASE_URL] = if (normalized.isEmpty()) DEFAULT_BASE_URL else "$normalized/" }
    }

    suspend fun setApiKey(value: String) {
        prefs.edit { it[KEY_API_KEY] = value.trim() }
    }

    suspend fun setRefreshMs(value: Long) {
        prefs.edit { it[KEY_REFRESH_MS] = value.coerceAtLeast(2_000L) }
    }

    suspend fun setSelectedDevice(value: String) {
        prefs.edit { it[KEY_DEVICE] = value }
    }

    companion object {
        /** 10.0.2.2 = host loopback từ Android Emulator. Người dùng nên đổi qua màn Settings. */
        const val DEFAULT_BASE_URL = "http://10.0.2.2:3010/"
        val KEY_BASE_URL = stringPreferencesKey("base_url")
        val KEY_API_KEY = stringPreferencesKey("api_key")
        val KEY_REFRESH_MS = longPreferencesKey("refresh_ms")
        val KEY_DEVICE = stringPreferencesKey("selected_device")
    }
}
