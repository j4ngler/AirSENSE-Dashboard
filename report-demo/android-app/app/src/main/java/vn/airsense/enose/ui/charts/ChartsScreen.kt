package vn.airsense.enose.ui.charts

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import vn.airsense.enose.ui.dashboard.ADC_LABELS
import vn.airsense.enose.ui.theme.ChartPalette

@Composable
fun ChartsScreen(vm: ChartsViewModel = hiltViewModel()) {
    val s by vm.state.collectAsStateWithLifecycle()
    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Text("Biểu đồ 24h gần nhất", style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.weight(1f))
            FilledTonalButton(onClick = vm::refresh) { Text("Làm mới") }
        }

        s.errorMsg?.let {
            Surface(color = MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium) {
                Text(it, modifier = Modifier.padding(12.dp))
            }
        }

        ElevatedCard {
            Column(Modifier.padding(12.dp)) {
                Text("Nhiệt độ & Độ ẩm", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))
                MultiLineChart(
                    series = listOf(
                        LineSeries("Temp (°C)", s.temp, ChartPalette.temperature),
                        LineSeries("Hum (%)", s.hum, ChartPalette.humidity),
                    ),
                    scaleEach = true,
                )
            }
        }

        ElevatedCard {
            Column(Modifier.padding(12.dp)) {
                Text("8 kênh ADC (EtOH1–6, VOC1–2)", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))
                val series = ADC_LABELS.mapIndexed { idx, label ->
                    LineSeries(
                        label = label,
                        values = s.adc[label].orEmpty(),
                        color = ChartPalette.adc[idx % ChartPalette.adc.size],
                    )
                }
                MultiLineChart(series = series, scaleEach = true)
            }
        }

        if (s.loading) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
    }
}
