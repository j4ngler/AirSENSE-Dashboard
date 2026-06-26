package vn.airsense.enose.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import vn.airsense.enose.data.remote.dto.SensorDoc
import vn.airsense.enose.ui.theme.ChartPalette

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(vm: DashboardViewModel = hiltViewModel()) {
    val s by vm.state.collectAsStateWithLifecycle()

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        DeviceHeader(state = s, onPick = vm::selectDevice, onRefresh = vm::refreshNow)

        if (s.errorMsg != null) {
            ErrorBanner(s.errorMsg!!)
        }

        KpiRow(latest = s.latest, status = s.status)

        ActionRow(
            measuring = (s.active?.active == true),
            onStart = vm::startMeasurement,
            onStop = vm::stopMeasurement,
        )

        SwitchesRow(
            heating = s.heatingPending ?: (s.status?.heatingEnabled == true),
            pump = s.pumpPending ?: (s.status?.airPumpEnabled == true),
            onHeating = vm::setHeating,
            onPump = vm::setPump,
        )

        Text("8 kênh cảm biến (giá trị mới nhất)", style = MaterialTheme.typography.titleMedium)
        AdcGrid(latest = s.latest)

        ControlSummary(s.control)

        s.active?.measurement?.let { m ->
            ElevatedCard {
                Column(Modifier.padding(12.dp)) {
                    Text("Đang đo", style = MaterialTheme.typography.titleMedium)
                    Text("File: ${m.fileName ?: "—"}")
                    Text("Status: ${m.status ?: "—"} • Mẫu: ${m.samplesCount ?: 0}")
                }
            }
        }
    }
}

@Composable
private fun DeviceHeader(
    state: DashboardState,
    onPick: (String) -> Unit,
    onRefresh: () -> Unit,
) {
    var expanded by remember { mutableStateOf(false) }
    ElevatedCard(Modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text("Thiết bị", style = MaterialTheme.typography.labelMedium)
                Box {
                    TextButton(onClick = { expanded = true }) {
                        Text(
                            state.deviceCode.ifBlank { "(chưa chọn)" },
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                    DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        state.devices.forEach { d ->
                            DropdownMenuItem(
                                text = { Text("${d.deviceCode} • ${d.status ?: "?"}") },
                                onClick = {
                                    onPick(d.deviceCode)
                                    expanded = false
                                }
                            )
                        }
                    }
                }
            }
            WifiChip(status = state.status?.wifiStatus, ip = state.status?.wifiIp)
            Spacer(Modifier.width(8.dp))
            FilledTonalButton(onClick = onRefresh) { Text("Làm mới") }
        }
    }
}

@Composable
private fun WifiChip(status: String?, ip: String?) {
    val online = status == "connected" || (!ip.isNullOrBlank())
    val color = if (online) Color(0xFF16A34A) else MaterialTheme.colorScheme.error
    AssistChip(
        onClick = {},
        leadingIcon = {
            if (online) Icon(Icons.Default.Wifi, null, tint = color)
            else Icon(Icons.Default.WifiOff, null, tint = color)
        },
        label = { Text(if (online) (ip ?: "Online") else "Mất kết nối") },
    )
}

@Composable
private fun KpiRow(latest: SensorDoc?, status: vn.airsense.enose.data.remote.dto.DeviceStatusDto?) {
    val temp = latest?.number("Temperature") ?: latest?.number("temperature")
    val hum = latest?.number("Humidity") ?: latest?.number("humidity")
    val signal = status?.wifiSignal

    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        KpiCard("Nhiệt độ", value = temp?.let { "%.1f".format(it) } ?: "--", unit = "°C", color = ChartPalette.temperature, modifier = Modifier.weight(1f))
        KpiCard("Độ ẩm", value = hum?.let { "%.1f".format(it) } ?: "--", unit = "%", color = ChartPalette.humidity, modifier = Modifier.weight(1f))
        KpiCard("WiFi", value = signal?.toString() ?: "--", unit = "dBm", color = Color(0xFF7C3AED), modifier = Modifier.weight(1f))
    }
}

@Composable
private fun KpiCard(label: String, value: String, unit: String, color: Color, modifier: Modifier = Modifier) {
    ElevatedCard(modifier = modifier) {
        Column(Modifier.padding(12.dp)) {
            Text(label, style = MaterialTheme.typography.labelMedium)
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text(value, fontSize = 28.sp, fontWeight = FontWeight.Bold, color = color)
                Spacer(Modifier.width(4.dp))
                Text(unit, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun ActionRow(measuring: Boolean, onStart: () -> Unit, onStop: () -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        Button(
            onClick = onStart,
            enabled = !measuring,
            modifier = Modifier.weight(1f)
        ) {
            Icon(Icons.Default.PlayArrow, null); Spacer(Modifier.width(6.dp)); Text("Bắt đầu đo")
        }
        OutlinedButton(
            onClick = onStop,
            enabled = measuring,
            modifier = Modifier.weight(1f)
        ) {
            Icon(Icons.Default.Stop, null); Spacer(Modifier.width(6.dp)); Text("Dừng đo")
        }
    }
}

@Composable
private fun SwitchesRow(
    heating: Boolean, pump: Boolean,
    onHeating: (Boolean) -> Unit, onPump: (Boolean) -> Unit
) {
    ElevatedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            SwitchRow("Heating", heating, onHeating)
            HorizontalDivider()
            SwitchRow("Air pump", pump, onPump)
        }
    }
}

@Composable
private fun SwitchRow(label: String, value: Boolean, onChange: (Boolean) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, modifier = Modifier.weight(1f))
        Switch(checked = value, onCheckedChange = onChange)
    }
}

@Composable
private fun AdcGrid(latest: SensorDoc?) {
    val adc = latest?.adcArray()
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        modifier = Modifier.heightIn(min = 0.dp, max = 360.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        items(ADC_LABELS) { label ->
            val idx = ADC_LABELS.indexOf(label)
            val v = latest?.number(label)
                ?: latest?.number("ADC$idx")
                ?: adc?.getOrNull(idx)
            AdcCard(label = label, value = v, color = ChartPalette.adc[idx % ChartPalette.adc.size])
        }
    }
}

@Composable
private fun AdcCard(label: String, value: Double?, color: Color) {
    ElevatedCard {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier
                    .size(10.dp)
                    .clip(RoundedCornerShape(50))
                    .background(color)
            )
            Spacer(Modifier.width(8.dp))
            Column(Modifier.weight(1f)) {
                Text(label, style = MaterialTheme.typography.labelMedium)
                Text(value?.let { "%.0f".format(it) } ?: "--", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun ControlSummary(c: vn.airsense.enose.data.remote.dto.ControlStatusDto?) {
    ElevatedCard(Modifier.fillMaxWidth()) {
        Row(Modifier.padding(12.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
            SummaryCol("Tổng", "${c?.total ?: "--"}")
            SummaryCol("Online", "${c?.online ?: "--"}", color = Color(0xFF16A34A))
            SummaryCol("Offline", "${c?.offline ?: "--"}", color = MaterialTheme.colorScheme.error)
            SummaryCol("Lệnh/giờ", "${c?.recent ?: "--"}")
        }
    }
}

@Composable
private fun RowScope.SummaryCol(label: String, value: String, color: Color = MaterialTheme.colorScheme.onSurface) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
        Text(value, style = MaterialTheme.typography.titleLarge, color = color, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.labelSmall)
    }
}

@Composable
private fun ErrorBanner(message: String) {
    Surface(
        color = MaterialTheme.colorScheme.errorContainer,
        shape = MaterialTheme.shapes.medium,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(message, color = MaterialTheme.colorScheme.onErrorContainer, modifier = Modifier.padding(12.dp))
    }
}
