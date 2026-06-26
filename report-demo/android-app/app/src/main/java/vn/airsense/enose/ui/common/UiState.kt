package vn.airsense.enose.ui.common

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Error(val message: String) : UiState<Nothing>
    data class Data<T>(val value: T) : UiState<T>
}

object TimeFmt {
    private val zone = ZoneId.of("Asia/Ho_Chi_Minh")
    private val full = DateTimeFormatter.ofPattern("dd/MM HH:mm:ss").withZone(zone)
    private val hm = DateTimeFormatter.ofPattern("HH:mm").withZone(zone)

    fun fromEpochSec(sec: Long?): String =
        sec?.takeIf { it > 0 }?.let { full.format(Instant.ofEpochSecond(it)) } ?: "—"

    fun hmFromEpochSec(sec: Long?): String =
        sec?.takeIf { it > 0 }?.let { hm.format(Instant.ofEpochSecond(it)) } ?: ""
}

fun userMessageFromError(e: Throwable): String {
    val raw = e.message.orEmpty()
    return when {
        raw.contains("401") -> "Sai hoặc thiếu API key. Mở Cài đặt để cập nhật."
        raw.contains("404") -> "Không tìm thấy dữ liệu cho thiết bị này."
        Regex("5\\d\\d").containsMatchIn(raw) -> "Máy chủ đang lỗi. Thử lại sau."
        raw.contains("timeout", true) -> "Máy chủ trả lời chậm. Kiểm tra mạng."
        raw.contains("Failed to connect", true) || raw.contains("Unable to resolve host", true) ->
            "Không kết nối được tới máy chủ. Kiểm tra URL và mạng."
        else -> "Đã xảy ra lỗi: ${raw.ifBlank { e::class.java.simpleName }}"
    }
}
