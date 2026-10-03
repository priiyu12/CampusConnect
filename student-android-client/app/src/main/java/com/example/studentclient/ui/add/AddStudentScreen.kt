package com.example.studentclient.ui.add

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.example.studentclient.data.RetrofitClient
import com.example.studentclient.data.Student
import kotlinx.coroutines.launch

@Composable
fun AddStudentScreen(onBack: () -> Unit, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var course by remember { mutableStateOf("") }
    var semester by remember { mutableStateOf("1") }
    var isSubmitting by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxSize()) {
        Text("Add New Student", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = course,
            onValueChange = { course = it },
            label = { Text("Course") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = semester,
            onValueChange = { semester = it },
            label = { Text("Semester") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(
                enabled = !isSubmitting,
                onClick = {
                    if (name.isBlank() || email.isBlank() || course.isBlank() || semester.isBlank()) {
                        Toast.makeText(context, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    val sem = semester.trim().toIntOrNull()
                    if (sem == null || sem < 1) {
                        Toast.makeText(context, "Invalid semester", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isSubmitting = true
                    coroutineScope.launch {
                        try {
                            val newStudent = Student(
                                name = name.trim(), 
                                email = email.trim(), 
                                course = course.trim(), 
                                semester = sem
                            )
                            RetrofitClient.instance.addStudent(newStudent)
                            Toast.makeText(context, "Student Added Successfully!", Toast.LENGTH_SHORT).show()
                            onBack()
                        } catch (e: retrofit2.HttpException) {
                            val errorBody = e.response()?.errorBody()?.string() ?: "Validation error"
                            Toast.makeText(context, errorBody, Toast.LENGTH_LONG).show()
                        } catch (e: Exception) {
                            Toast.makeText(context, "Something went wrong", Toast.LENGTH_SHORT).show()
                        } finally {
                            isSubmitting = false
                        }
                    }
                }
            ) {
                Text(if (isSubmitting) "Saving..." else "Save")
            }
            
            OutlinedButton(onClick = onBack) {
                Text("Cancel")
            }
        }
    }
}
