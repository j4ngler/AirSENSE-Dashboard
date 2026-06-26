package vn.airsense.enose.data.repo

import vn.airsense.enose.data.remote.EnoseApi
import vn.airsense.enose.data.remote.dto.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EnoseRepository @Inject constructor(
    private val api: EnoseApi
) {
    suspend fun health(): HealthDto = api.health()
    suspend fun appConfig(): AppConfigDto = api.appConfig()

    suspend fun devices(): List<DeviceDto> = api.devices().devices.filter { it.deleteFlag != 1 }
    suspend fun latest(id: String): SensorDoc? = api.latest(id).data
    suspend fun status(id: String): DeviceStatusDto? = api.status(id).data
    suspend fun history(id: String, limit: Int = 120): List<SensorDoc> = api.history(id, limit).data
    suspend fun measurements(id: String): List<MeasurementDto> = api.measurements(id).data
    suspend fun activeMeasurement(id: String): ActiveMeasurementResponse = api.activeMeasurement(id)
    suspend fun controlStatus(): ControlStatusDto = api.controlStatus()

    suspend fun start(id: String): StartResponse = api.startMeasurement(id)
    suspend fun stop(id: String): SuccessResponse = api.stopMeasurement(id)
    suspend fun setHeating(id: String, on: Boolean) = api.setHeating(id, SwitchBody(on))
    suspend fun setAirPump(id: String, on: Boolean) = api.setAirPump(id, SwitchBody(on))

    suspend fun channels(id: String): List<ChannelDto> = api.channels(id).channels
    suspend fun createChannel(id: String, body: ChannelCreateBody) = api.createChannel(id, body).channel
    suspend fun updateChannel(channelId: Int, body: ChannelUpdateBody) = api.updateChannel(channelId, body).channel
    suspend fun deleteChannel(channelId: Int) = api.deleteChannel(channelId)
}
