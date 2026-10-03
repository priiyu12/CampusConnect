package com.example.studentclient.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

data class Student(
    val id: String? = null,
    val name: String,
    val email: String,
    val course: String,
    val semester: Int
)

interface StudentApi {
    @GET("/students")
    suspend fun getStudents(): List<Student>

    @POST("/students")
    suspend fun addStudent(@Body student: Student): Student
}

object RetrofitClient {
    // 10.0.2.2 is the alias for your host loopback interface (127.0.0.1) on the Android emulator
    private const val BASE_URL = "http://10.0.2.2:8081"

    val instance: StudentApi by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        retrofit.create(StudentApi::class.java)
    }
}
