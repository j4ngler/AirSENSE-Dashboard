package vn.airsense.enose.data.remote

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query
import vn.airsense.enose.data.remote.dto.*

interface EnoseApi {

    @GET("config.json")
    suspend fun appConfig(): AppConfigDto

    @GET("api/health")
    suspend fun health(): HealthDto

    @GET("api/enose/devices")
    suspend fun devices(): DevicesResponse

    @GET("api/enose/devices/{id}/latest")
    suspend fun latest(@Path("id") deviceId: String): LatestResponse

    @GET("api/enose/devices/{id}/status")
    suspend fun status(@Path("id") deviceId: String): StatusResponse

    @GET("api/enose/devices/{id}/history")
    suspend fun history(
        @Path("id") deviceId: String,
        @Query("limit") limit: Int = 120,
        @Query("from") from: String? = null,
        @Query("to") to: String? = null,
    ): HistoryResponse

    @GET("api/enose/devices/{id}/measurements")
    suspend fun measurements(@Path("id") deviceId: String): MeasurementsResponse

    @GET("api/enose/devices/measurements/active")
    suspend fun activeMeasurement(@Query("device_id") deviceId: String): ActiveMeasurementResponse

    @GET("api/enose/control/status")
    suspend fun controlStatus(): ControlStatusDto

    @POST("api/enose/devices/{id}/start")
    suspend fun startMeasurement(@Path("id") deviceId: String, @Body body: Map<String, String> = emptyMap()): StartResponse

    @POST("api/enose/devices/{id}/stop")
    suspend fun stopMeasurement(@Path("id") deviceId: String, @Body body: Map<String, String> = emptyMap()): SuccessResponse

    @POST("api/enose/devices/{id}/heating")
    suspend fun setHeating(@Path("id") deviceId: String, @Body body: SwitchBody): SuccessResponse

    @POST("api/enose/devices/{id}/air-pump")
    suspend fun setAirPump(@Path("id") deviceId: String, @Body body: SwitchBody): SuccessResponse

    @GET("api/enose/devices/{id}/sensor-channels")
    suspend fun channels(@Path("id") deviceId: String): ChannelsResponse

    @POST("api/enose/devices/{id}/sensor-channels")
    suspend fun createChannel(@Path("id") deviceId: String, @Body body: ChannelCreateBody): ChannelResponse

    @PATCH("api/enose/sensor-channels/{channelId}")
    suspend fun updateChannel(@Path("channelId") channelId: Int, @Body body: ChannelUpdateBody): ChannelResponse

    @POST("api/enose/sensor-channels/{channelId}/delete")
    suspend fun deleteChannel(@Path("channelId") channelId: Int, @Body body: Map<String, String> = emptyMap()): SuccessResponse
}
