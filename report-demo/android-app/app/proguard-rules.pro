# Moshi reflection / codegen
-keep class com.squareup.moshi.** { *; }
-keepclassmembers class * {
  @com.squareup.moshi.JsonClass *;
}
-keep class kotlin.reflect.jvm.internal.impl.** { *; }

# OkHttp / Retrofit
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn retrofit2.**
-keepattributes Signature
-keepattributes *Annotation*

# Hilt
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
   <init>(...);
}

# Vico
-keep class com.patrykandpatrick.vico.** { *; }
