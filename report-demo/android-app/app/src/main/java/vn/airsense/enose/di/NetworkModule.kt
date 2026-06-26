package vn.airsense.enose.di

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import vn.airsense.enose.data.remote.EnoseApi
import vn.airsense.enose.data.repo.ConfigRepository
import java.util.concurrent.TimeUnit
import javax.inject.Provider
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideMoshi(): Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    /** Interceptor đọc base URL và API key MỖI request → thay đổi cấu hình không cần restart app. */
    @Provides
    @Singleton
    fun provideOkHttp(
        configProvider: Provider<ConfigRepository>,
    ): OkHttpClient {
        val log = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }

        val dynamic = Interceptor { chain ->
            val repo = configProvider.get()
            val (baseUrl, apiKey) = runBlocking {
                Pair(repo.baseUrl.first(), repo.apiKey.first())
            }

            val original = chain.request()
            val newUrl = baseUrl.toHttpUrlOrNull()?.let { base ->
                original.url.newBuilder()
                    .scheme(base.scheme)
                    .host(base.host)
                    .port(base.port)
                    .build()
            } ?: original.url

            val builder = original.newBuilder().url(newUrl)
            if (apiKey.isNotBlank()) {
                builder.header("X-API-Key", apiKey)
            }
            chain.proceed(builder.build())
        }

        return OkHttpClient.Builder()
            .addInterceptor(dynamic)
            .addInterceptor(log)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(client: OkHttpClient, moshi: Moshi): Retrofit = Retrofit.Builder()
        /* Placeholder — interceptor sẽ ghi đè host/port theo cấu hình DataStore. */
        .baseUrl("http://placeholder.local/")
        .client(client)
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .build()

    @Provides
    @Singleton
    fun provideEnoseApi(retrofit: Retrofit): EnoseApi = retrofit.create(EnoseApi::class.java)
}
