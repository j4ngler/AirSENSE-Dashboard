package vn.airsense.enose.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class DevicesResponse(
    val success: Boolean,
    val devices: List<DeviceDto> = emptyList()
)

@JsonClass(generateAdapter = true)
data class DeviceDto(
    @Json(name = "device_id") val deviceId: Int,
    @Json(name = "device_code") val deviceCode: String,
    val name: String?,
    val status: String?,
    @Json(name = "mqtt_topic") val mqttTopic: String?,
    @Json(name = "last_seen") val lastSeen: String?,
    @Json(name = "delete_flag") val deleteFlag: Int?
)

@JsonClass(generateAdapter = true)
data class ControlStatusDto(
    @Json(name = "total_devices") val total: Int = 0,
    @Json(name = "online_devices") val online: Int = 0,
    @Json(name = "offline_devices") val offline: Int = 0,
    @Json(name = "recent_controls") val recent: Int = 0,
    val timestamp: String?
)

@JsonClass(generateAdapter = true)
data class HealthDto(
    val ok: Boolean,
    val mongo: String?,
    val pg: String?,
    val mqtt: String?,
    val ts: String?
)

@JsonClass(generateAdapter = true)
data class AppConfigDto(
    val title: String?,
    val apiBase: String?,
    val refreshMs: Long?,
    val measurementFileBaseUrl: String?,
    val requireApiKey: Boolean?
)
