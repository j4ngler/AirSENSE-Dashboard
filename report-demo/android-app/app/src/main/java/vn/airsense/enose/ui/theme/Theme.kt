package vn.airsense.enose.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFF2563EB),
    onPrimary = Color.White,
    secondary = Color(0xFF14B8A6),
    background = Color(0xFFF8FAFC),
    surface = Color.White,
    error = Color(0xFFDC2626),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF60A5FA),
    onPrimary = Color(0xFF0F172A),
    secondary = Color(0xFF5EEAD4),
    background = Color(0xFF0F172A),
    surface = Color(0xFF1E293B),
    error = Color(0xFFF87171),
)

@Composable
fun AirSenseTheme(
    dark: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        content = content
    )
}

object ChartPalette {
    val adc = listOf(
        Color(0xFF6366F1),
        Color(0xFFA855F7),
        Color(0xFFEC4899),
        Color(0xFFF97316),
        Color(0xFF14B8A6),
        Color(0xFF22C55E),
        Color(0xFFEAB308),
        Color(0xFF0EA5E9),
    )
    val temperature = Color(0xFFF97316)
    val humidity = Color(0xFF0EA5E9)
}
