package vn.airsense.enose.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class LatestResponse(
    val success: Boolean,
    val data: SensorDoc?
)

@JsonClass(generateAdapter = true)
data class HistoryResponse(
    val success: Boolean,
    val data: List<SensorDoc> = emptyList()
)

@JsonClass(generateAdapter = true)
data class SensorDoc(
    val topic: String?,
    val time: Long?,
    val content: Map<String, @JvmSuppressWildcards Any?>?,
    val createdAt: String?,
    val updatedAt: String?
) {
    /** Lấy giá trị thực số an toàn, hỗ trợ cả Number lẫn String. */
    fun number(key: String): Double? {
        val v = content?.get(key) ?: return null
        return when (v) {
            is Number -> v.toDouble()
            is String -> v.toDoubleOrNull()
            else -> null
        }
    }

    /** Mảng ADC trong content.adc (nếu có), về dạng List<Double>. */
    fun adcArray(): List<Double>? {
        val arr = content?.get("adc") as? List<*> ?: return null
        return arr.mapNotNull {
            when (it) {
                is Number -> it.toDouble()
                is String -> it.toDoubleOrNull()
                else -> null
            }
        }
    }
}

@JsonClass(generateAdapter = true)
data class StatusResponse(
    val success: Boolean,
    val data: DeviceStatusDto?
)

@JsonClass(generateAdapter = true)
data class DeviceStatusDto(
    @Json(name = "device_id") val deviceId: String?,
    val status: String?,
    @Json(name = "wifi_ssid") val wifiSsid: String?,
    @Json(name = "wifi_signal") val wifiSignal: Int?,
    @Json(name = "wifi_status") val wifiStatus: String?,
    @Json(name = "wifi_ip") val wifiIp: String?,
    val storage: Map<String, @JvmSuppressWildcards Any?>?,
    @Json(name = "heating_enabled") val heatingEnabled: Boolean?,
    @Json(name = "air_pump_enabled") val airPumpEnabled: Boolean?,
    @Json(name = "last_seen") val lastSeen: String?,
    val timestamp: String?
)

@JsonClass(generateAdapter = true)
data class MeasurementsResponse(
    val success: Boolean,
    val data: List<MeasurementDto> = emptyList()
)

@JsonClass(generateAdapter = true)
data class ActiveMeasurementResponse(
    val active: Boolean,
    val measurement: MeasurementDto?,
    val canStart: Boolean
)

@JsonClass(generateAdapter = true)
data class MeasurementDto(
    @Json(name = "device_id") val deviceId: String?,
    @Json(name = "file_name") val fileName: String?,
    val status: String?,
    val progress: Int?,
    @Json(name = "samples_count") val samplesCount: Int?,
    @Json(name = "started_at") val startedAt: String?,
    @Json(name = "completed_at") val completedAt: String?,
    val createdAt: String?,
    val updatedAt: String?
)

@JsonClass(generateAdapter = true)
data class StartResponse(
    val success: Boolean,
    @Json(name = "file_name") val fileName: String?,
    @Json(name = "started_at") val startedAt: String?,
    @Json(name = "device_id") val deviceId: String?
)

@JsonClass(generateAdapter = true)
data class SuccessResponse(
    val success: Boolean,
    val message: String? = null
)

@JsonClass(generateAdapter = true)
data class SwitchBody(val on: Boolean)
