package vn.airsense.enose

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import dagger.hilt.android.AndroidEntryPoint
import vn.airsense.enose.ui.MainNav
import vn.airsense.enose.ui.theme.AirSenseTheme

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AirSenseTheme {
                MainNav()
            }
        }
    }
}
