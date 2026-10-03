package com.example.studentclient.ui.main

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import com.example.studentclient.AddStudent
import com.example.studentclient.data.RetrofitClient
import com.example.studentclient.data.Student
import kotlinx.coroutines.launch

@Composable
fun MainScreen(onItemClick: (NavKey) -> Unit, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var students by remember { mutableStateOf<List<Student>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            students = RetrofitClient.instance.getStudents()
        } catch (e: Exception) {
            Toast.makeText(context, "Unable to load data. Please try again.", Toast.LENGTH_LONG).show()
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { onItemClick(AddStudent) }) {
                Text("+")
            }
        }
    ) { padding ->
        Column(modifier = modifier.padding(padding).fillMaxSize()) {
            Text("Students List", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(16.dp))

            if (isLoading) {
                CircularProgressIndicator()
            } else if (students.isEmpty()) {
                Text("No students found.")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(students) { student ->
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(student.name, style = MaterialTheme.typography.titleLarge)
                                Text(student.email, style = MaterialTheme.typography.bodyMedium)
                                Text("${student.course} - Sem ${student.semester}", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
            }
        }
    }
}
