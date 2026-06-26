package vn.airsense.enose.ui.devices

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import vn.airsense.enose.data.remote.dto.ChannelDto
import vn.airsense.enose.data.remote.dto.ChannelUpdateBody

@Composable
fun DevicesScreen(vm: DevicesViewModel = hiltViewModel()) {
    val s by vm.state.collectAsStateWithLifecycle()
    var editing by remember { mutableStateOf<ChannelDto?>(null) }

    Column(
        Modifier
            .fillMaxSize()
            .padding(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Kênh cảm biến (${s.deviceCode})", style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.weight(1f))
            FilledTonalButton(onClick = vm::reload) { Text("Tải lại") }
        }

        s.errorMsg?.let {
            Surface(color = MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium, modifier = Modifier.padding(top = 8.dp)) {
                Text(it, modifier = Modifier.padding(12.dp))
            }
        }
        s.infoMsg?.let {
            Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = MaterialTheme.shapes.medium, modifier = Modifier.padding(top = 8.dp)) {
                Text(it, modifier = Modifier.padding(12.dp))
            }
        }

        Spacer(Modifier.height(8.dp))
        AddChannelCard(onAdd = { idx, label, unit, sort -> vm.add(idx, label, unit, sort) })

        Spacer(Modifier.height(8.dp))
        if (s.loading) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())

        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            items(s.channels) { ch ->
                ChannelRow(ch, onEdit = { editing = ch }, onDelete = { vm.delete(ch) })
            }
        }

        editing?.let { ch ->
            EditDialog(
                channel = ch,
                onDismiss = { editing = null },
                onSave = { body ->
                    vm.update(ch, body)
                    editing = null
                }
            )
        }
    }
}

@Composable
private fun AddChannelCard(onAdd: (Int, String, String, Int) -> Unit) {
    var idx by remember { mutableStateOf("0") }
    var label by remember { mutableStateOf("") }
    var unit by remember { mutableStateOf("ADC") }
    var sort by remember { mutableStateOf("0") }

    ElevatedCard {
        Column(Modifier.padding(12.dp)) {
            Text("Thêm kênh mới", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = idx,
                    onValueChange = { idx = it.filter(Char::isDigit) },
                    label = { Text("ADC index (0..31)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                )
                OutlinedTextField(
                    value = sort,
                    onValueChange = { sort = it.filter { c -> c.isDigit() } },
                    label = { Text("Sort") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                )
            }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = label,
                    onValueChange = { label = it },
                    label = { Text("Label") },
                    modifier = Modifier.weight(1.4f),
                    singleLine = true,
                )
                OutlinedTextField(
                    value = unit,
                    onValueChange = { unit = it },
                    label = { Text("Unit") },
                    modifier = Modifier.weight(0.8f),
                    singleLine = true,
                )
            }
            Spacer(Modifier.height(8.dp))
            Button(
                onClick = {
                    val i = idx.toIntOrNull() ?: return@Button
                    val so = sort.toIntOrNull() ?: 0
                    if (label.isBlank()) return@Button
                    onAdd(i, label.trim(), unit.trim().ifBlank { "ADC" }, so)
                    label = ""
                },
                modifier = Modifier.align(Alignment.End),
            ) { Text("Thêm kênh") }
        }
    }
}

@Composable
private fun ChannelRow(ch: ChannelDto, onEdit: () -> Unit, onDelete: () -> Unit) {
    ElevatedCard {
        Row(
            Modifier.fillMaxWidth().padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(Modifier.weight(1f)) {
                Text(ch.label, style = MaterialTheme.typography.titleMedium)
                Text("idx=${ch.channelIndex} • ${ch.unit ?: "ADC"} • sort=${ch.sortOrder ?: 0}", style = MaterialTheme.typography.bodySmall)
            }
            IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, null) }
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, null, tint = MaterialTheme.colorScheme.error) }
        }
    }
}

@Composable
private fun EditDialog(channel: ChannelDto, onDismiss: () -> Unit, onSave: (ChannelUpdateBody) -> Unit) {
    var label by remember { mutableStateOf(channel.label) }
    var unit by remember { mutableStateOf(channel.unit ?: "ADC") }
    var sort by remember { mutableStateOf((channel.sortOrder ?: 0).toString()) }
    var idx by remember { mutableStateOf(channel.channelIndex.toString()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(onClick = {
                onSave(
                    ChannelUpdateBody(
                        label = label.trim().ifBlank { null },
                        unit = unit.trim().ifBlank { null },
                        sortOrder = sort.toIntOrNull(),
                        channelIndex = idx.toIntOrNull(),
                    )
                )
            }) { Text("Lưu") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Hủy") } },
        title = { Text("Chỉnh kênh #${channel.sensorChannelId}") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.verticalScroll(rememberScrollState())) {
                OutlinedTextField(value = label, onValueChange = { label = it }, label = { Text("Label") }, singleLine = true)
                OutlinedTextField(value = unit, onValueChange = { unit = it }, label = { Text("Unit") }, singleLine = true)
                OutlinedTextField(
                    value = idx,
                    onValueChange = { idx = it.filter(Char::isDigit) },
                    label = { Text("Channel index 0..31") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                )
                OutlinedTextField(
                    value = sort,
                    onValueChange = { sort = it.filter { c -> c.isDigit() || c == '-' } },
                    label = { Text("Sort order") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                )
            }
        }
    )
}
