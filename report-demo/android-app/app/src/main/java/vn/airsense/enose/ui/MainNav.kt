package vn.airsense.enose.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import vn.airsense.enose.ui.charts.ChartsScreen
import vn.airsense.enose.ui.dashboard.DashboardScreen
import vn.airsense.enose.ui.devices.DevicesScreen
import vn.airsense.enose.ui.history.HistoryScreen
import vn.airsense.enose.ui.settings.SettingsScreen

private enum class Tab(val route: String, val labelRes: Int, val icon: ImageVector) {
    Dashboard("dashboard", vn.airsense.enose.R.string.tab_dashboard, Icons.Default.Dashboard),
    Charts("charts", vn.airsense.enose.R.string.tab_charts, Icons.Default.BarChart),
    History("history", vn.airsense.enose.R.string.tab_history, Icons.Default.History),
    Devices("devices", vn.airsense.enose.R.string.tab_devices, Icons.Default.Memory),
    Settings("settings", vn.airsense.enose.R.string.tab_settings, Icons.Default.Settings),
}

@Composable
fun MainNav() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val current = backStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar {
                Tab.entries.forEach { tab ->
                    NavigationBarItem(
                        selected = current == tab.route,
                        onClick = {
                            navController.navigate(tab.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(tab.icon, contentDescription = null) },
                        label = { Text(androidx.compose.ui.res.stringResource(tab.labelRes)) },
                    )
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Tab.Dashboard.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(Tab.Dashboard.route) { DashboardScreen() }
            composable(Tab.Charts.route) { ChartsScreen() }
            composable(Tab.History.route) { HistoryScreen() }
            composable(Tab.Devices.route) { DevicesScreen() }
            composable(Tab.Settings.route) { SettingsScreen() }
        }
    }
}
