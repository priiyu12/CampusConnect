const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusconnect';

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: Number, required: true, min: 1 }
}, { versionKey: false, _id: false });

const Student = mongoose.model('Student', studentSchema);

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Validation helper
const validateStudent = (student, isPartial = false) => {
  const errors = [];
  if (!isPartial || student.name !== undefined) {
    if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') errors.push("Valid name is required");
  }
  if (!isPartial || student.email !== undefined) {
    if (!student.email || typeof student.email !== 'string' || !student.email.includes('@')) errors.push("Valid email is required");
  }
  if (!isPartial || student.course !== undefined) {
    if (!student.course || typeof student.course !== 'string' || student.course.trim() === '') errors.push("Valid course is required");
  }
  if (!isPartial || student.semester !== undefined) {
    if (student.semester === undefined || typeof student.semester !== 'number' || student.semester < 1) errors.push("Valid positive semester number is required");
  }
  return errors;
};

// GET all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}, { _id: 0 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const student = await Student.findOne({ id }, { _id: 0 });
    
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new student
app.post('/students', async (req, res) => {
  try {
    const errors = validateStudent(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Generate numeric ID
    const maxStudent = await Student.findOne().sort({ id: -1 });
    const nextId = maxStudent ? maxStudent.id + 1 : 1;

    const newStudent = new Student({
      id: nextId,
      name: req.body.name,
      email: req.body.email,
      course: req.body.course,
      semester: req.body.semester
    });
    
    await newStudent.save();
    
    res.status(201).json(newStudent.toObject());
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT (update) a student
app.put('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const errors = validateStudent(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { id },
      {
        name: req.body.name,
        email: req.body.email,
        course: req.body.course,
        semester: req.body.semester
      },
      { new: true, runValidators: true, projection: { _id: 0 } }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH (partial update) a student
app.patch('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const errors = validateStudent(req.body, true);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updateFields = {};
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.email !== undefined) updateFields.email = req.body.email;
    if (req.body.course !== undefined) updateFields.course = req.body.course;
    if (req.body.semester !== undefined) updateFields.semester = req.body.semester;

    const updatedStudent = await Student.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true, runValidators: true, projection: { _id: 0 } }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a student
app.delete('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Student.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
