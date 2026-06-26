package vn.airsense.enose.ui.history

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import vn.airsense.enose.ui.common.TimeFmt
import vn.airsense.enose.ui.dashboard.ADC_LABELS

@Composable
fun HistoryScreen(vm: HistoryViewModel = hiltViewModel()) {
    val s by vm.state.collectAsStateWithLifecycle()

    Column(
        Modifier
            .fillMaxSize()
            .padding(12.dp)
    ) {
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Text("Lịch sử điểm đo (120 mẫu)", style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.weight(1f))
            FilledTonalButton(onClick = vm::reload) { Text("Tải lại") }
        }
        Spacer(Modifier.height(8.dp))

        s.errorMsg?.let {
            Surface(color = MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium) {
                Text(it, modifier = Modifier.padding(12.dp))
            }
            Spacer(Modifier.height(8.dp))
        }

        if (s.loading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        }

        // Header
        Row(
            Modifier.fillMaxWidth().padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            HeaderCell("Thời gian", weight = 1.4f)
            HeaderCell("Temp °C", weight = 0.7f)
            HeaderCell("Hum %", weight = 0.7f)
            HeaderCell("ADC summary", weight = 2.0f)
        }
        HorizontalDivider()

        LazyColumn(modifier = Modifier.fillMaxSize()) {
            items(s.rows) { doc ->
                val temp = doc.number("Temperature") ?: doc.number("temperature")
                val hum = doc.number("Humidity") ?: doc.number("humidity")
                val adcSummary = summarizeAdc(doc)
                Row(
                    Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    BodyCell(TimeFmt.fromEpochSec(doc.time), weight = 1.4f)
                    BodyCell(temp?.let { "%.1f".format(it) } ?: "--", weight = 0.7f)
                    BodyCell(hum?.let { "%.1f".format(it) } ?: "--", weight = 0.7f)
                    BodyCell(adcSummary, weight = 2.0f)
                }
                HorizontalDivider(thickness = 0.5.dp)
            }
        }
    }
}

private fun summarizeAdc(doc: vn.airsense.enose.data.remote.dto.SensorDoc): String {
    val adc = doc.adcArray()
    val vals = ADC_LABELS.mapIndexedNotNull { idx, label ->
        doc.number(label) ?: doc.number("ADC$idx") ?: adc?.getOrNull(idx)
    }
    if (vals.isEmpty()) return "—"
    val mn = vals.min(); val mx = vals.max()
    val avg = vals.average()
    return "min %.0f / avg %.0f / max %.0f".format(mn, avg, mx)
}

@Composable
private fun androidx.compose.foundation.layout.RowScope.HeaderCell(t: String, weight: Float) {
    Text(t, modifier = Modifier.weight(weight), style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.SemiBold)
}

@Composable
private fun androidx.compose.foundation.layout.RowScope.BodyCell(t: String, weight: Float) {
    Text(t, modifier = Modifier.weight(weight), style = MaterialTheme.typography.bodySmall)
}
