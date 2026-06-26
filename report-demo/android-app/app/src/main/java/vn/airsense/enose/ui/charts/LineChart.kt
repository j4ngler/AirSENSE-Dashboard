package vn.airsense.enose.ui.charts

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp

data class LineSeries(
    val label: String,
    val values: List<Double>,
    val color: Color,
)

/**
 * Đa-series line chart đơn giản dùng Canvas. Tính min/max riêng từng series
 * khi `scaleEach=true` (hữu ích cho 8 ADC có dải khác nhau), hoặc dùng chung
 * min/max cho tất cả (mặc định cho temp/hum trục đôi).
 */
@Composable
fun MultiLineChart(
    series: List<LineSeries>,
    modifier: Modifier = Modifier,
    scaleEach: Boolean = true,
    showLegend: Boolean = true,
) {
    val empty = series.isEmpty() || series.all { it.values.isEmpty() }
    Column(modifier) {
        if (empty) {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text("Chưa có dữ liệu", color = MaterialTheme.colorScheme.outline)
            }
            return@Column
        }

        val gridColor = MaterialTheme.colorScheme.outlineVariant
        Canvas(
            Modifier
                .fillMaxWidth()
                .height(220.dp)
        ) {
            val padLeft = 32f
            val padRight = 12f
            val padTop = 12f
            val padBottom = 18f
            val plotW = size.width - padLeft - padRight
            val plotH = size.height - padTop - padBottom

            // 4 đường lưới ngang
            for (i in 0..4) {
                val y = padTop + plotH * i / 4f
                drawLine(
                    color = gridColor,
                    start = Offset(padLeft, y),
                    end = Offset(size.width - padRight, y),
                    strokeWidth = 1f,
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(6f, 6f)),
                )
            }

            val allMin = series.flatMap { it.values }.minOrNull() ?: 0.0
            val allMax = series.flatMap { it.values }.maxOrNull() ?: 1.0

            series.forEach { s ->
                if (s.values.size < 2) return@forEach
                val min = if (scaleEach) (s.values.min()) else allMin
                val max = if (scaleEach) (s.values.max()) else allMax
                val span = (max - min).takeIf { it > 1e-9 } ?: 1.0
                val n = s.values.size
                val path = Path()
                s.values.forEachIndexed { i, v ->
                    val x = padLeft + plotW * i / (n - 1).coerceAtLeast(1)
                    val y = padTop + plotH * (1f - ((v - min) / span).toFloat())
                    if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
                }
                drawPath(path = path, color = s.color, style = Stroke(width = 3f))
            }
        }

        if (showLegend) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                series.forEach { s ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            Modifier
                                .size(10.dp)
                                .clip(RoundedCornerShape(50))
                                .background(s.color),
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(s.label, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}
