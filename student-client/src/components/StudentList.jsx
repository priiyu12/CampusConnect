import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import StudentForm from './StudentForm';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_BASE_URL);
      setStudents(response.data);
    } catch (err) {
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert('Student not found.');
      } else {
        alert('Unable to delete data. Please try again.');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleFormSuccess = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Student Management</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <StudentForm 
        studentToEdit={editingStudent} 
        onSuccess={handleFormSuccess} 
        onCancel={() => setEditingStudent(null)} 
      />

      <hr style={{ margin: '20px 0' }} />

      <h2>Student List</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.course}</td>
                <td style={tdStyle}>{student.semester}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(student)} style={{ marginRight: '5px' }}>Edit</button>
                  <button onClick={() => handleDelete(student.id)} style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '10px' };

export default StudentList;
