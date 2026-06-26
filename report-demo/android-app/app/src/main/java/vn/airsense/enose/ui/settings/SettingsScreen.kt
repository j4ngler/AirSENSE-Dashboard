package vn.airsense.enose.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import vn.airsense.enose.R

@Composable
fun SettingsScreen(vm: SettingsViewModel = hiltViewModel()) {
    val s by vm.state.collectAsStateWithLifecycle()
    var showKey by remember { mutableStateOf(false) }

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Kết nối máy chủ", style = MaterialTheme.typography.titleLarge)

        OutlinedTextField(
            value = s.baseUrl,
            onValueChange = vm::onBaseUrlChange,
            label = { Text(stringResource(R.string.settings_base_url)) },
            placeholder = { Text(stringResource(R.string.settings_hint)) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )

        OutlinedTextField(
            value = s.apiKey,
            onValueChange = vm::onApiKeyChange,
            label = { Text(stringResource(R.string.settings_api_key)) },
            singleLine = true,
            visualTransformation = if (showKey) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                TextButton(onClick = { showKey = !showKey }) {
                    Text(if (showKey) "Ẩn" else "Hiện")
                }
            },
            supportingText = { Text("Để trống khi máy chủ không bật APP_API_KEY.") },
            modifier = Modifier.fillMaxWidth(),
        )

        OutlinedTextField(
            value = s.refreshMs.toString(),
            onValueChange = { v -> v.toLongOrNull()?.let(vm::onRefreshMsChange) },
            label = { Text("Chu kỳ làm mới (ms)") },
            singleLine = true,
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = KeyboardType.Number),
            supportingText = { Text("Khuyến nghị 10000 (10 giây), tối thiểu 2000.") },
            modifier = Modifier.fillMaxWidth(),
        )

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = vm::save, modifier = Modifier.weight(1f)) {
                Text(stringResource(R.string.settings_save))
            }
            OutlinedButton(
                onClick = vm::testConnection,
                enabled = !s.testing,
                modifier = Modifier.weight(1f)
            ) {
                if (s.testing) {
                    CircularProgressIndicator(strokeWidth = 2.dp, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                }
                Text(stringResource(R.string.settings_test))
            }
        }

        s.message?.let { msg ->
            val color = when (s.ok) {
                true -> MaterialTheme.colorScheme.primary
                false -> MaterialTheme.colorScheme.error
                else -> MaterialTheme.colorScheme.onSurface
            }
            Surface(
                color = color.copy(alpha = 0.08f),
                shape = MaterialTheme.shapes.medium,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(msg, color = color, modifier = Modifier.padding(12.dp))
            }
        }

        HorizontalDivider(Modifier.padding(vertical = 8.dp))

        Text("Hướng dẫn nhanh", style = MaterialTheme.typography.titleMedium)
        Text(
            """• LAN: dùng IP máy chủ, ví dụ http://192.168.1.10:3010
• Android Emulator: dùng http://10.0.2.2:3010 để gọi server trên máy host
• Internet: nên dùng HTTPS (đặt reverse-proxy nginx/caddy), điền URL https://...
• Nếu server bật APP_API_KEY, điền đúng vào ô API key, app sẽ tự gắn X-API-Key""",
            style = MaterialTheme.typography.bodySmall,
        )
    }
}
