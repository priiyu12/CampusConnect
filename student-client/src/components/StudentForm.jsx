import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function StudentForm({ studentToEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    semester: 1
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name,
        email: studentToEdit.email,
        course: studentToEdit.course,
        semester: studentToEdit.semester
      });
      setError('');
    } else {
      setFormData({ name: '', email: '', course: '', semester: 1 });
    }
  }, [studentToEdit]);

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return 'Valid email is required';
    if (!formData.course.trim()) return 'Course is required';
    if (!formData.semester || formData.semester < 1) return 'Semester must be a positive number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (studentToEdit) {
        await axios.put(`${API_BASE_URL}/${studentToEdit.id}`, formData);
      } else {
        await axios.post(API_BASE_URL, formData);
      }
      setFormData({ name: '', email: '', course: '', semester: 1 });
      onSuccess();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = err.response.data.errors;
        setError(`Validation Error: ${errors ? errors.join(', ') : 'Bad Request'}`);
      } else if (err.response && err.response.status === 404) {
         setError('Student not found.');
      } else {
        setError('Unable to save data. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'semester' ? parseInt(value) || '' : value }));
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3>{studentToEdit ? 'Edit Student' : 'Add New Student'}</h3>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Course:</label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Semester:</label>
          <input type="number" name="semester" min="1" value={formData.semester} onChange={handleChange} style={inputStyle} />
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <button type="submit" disabled={submitting} style={buttonStyle}>
            {submitting ? 'Saving...' : (studentToEdit ? 'Update Student' : 'Add Student')}
          </button>
          {studentToEdit && (
            <button type="button" onClick={onCancel} style={{ ...buttonStyle, backgroundColor: '#6c757d', marginLeft: '10px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const formGroupStyle = { marginBottom: '10px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const buttonStyle = { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default StudentForm;
