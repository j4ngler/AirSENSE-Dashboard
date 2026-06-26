package vn.airsense.enose.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ChannelsResponse(
    val success: Boolean,
    @Json(name = "device_code") val deviceCode: String?,
    val channels: List<ChannelDto> = emptyList()
)

@JsonClass(generateAdapter = true)
data class ChannelResponse(
    val success: Boolean,
    val channel: ChannelDto?
)

@JsonClass(generateAdapter = true)
data class ChannelDto(
    @Json(name = "sensor_channel_id") val sensorChannelId: Int,
    @Json(name = "device_code") val deviceCode: String,
    @Json(name = "channel_index") val channelIndex: Int,
    val label: String,
    val unit: String?,
    @Json(name = "sort_order") val sortOrder: Int?
)

@JsonClass(generateAdapter = true)
data class ChannelCreateBody(
    @Json(name = "channel_index") val channelIndex: Int,
    val label: String,
    val unit: String? = "ADC",
    @Json(name = "sort_order") val sortOrder: Int? = 0
)

@JsonClass(generateAdapter = true)
data class ChannelUpdateBody(
    val label: String? = null,
    val unit: String? = null,
    @Json(name = "sort_order") val sortOrder: Int? = null,
    @Json(name = "channel_index") val channelIndex: Int? = null
)
