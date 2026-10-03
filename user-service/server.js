const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3001;
const MONGO_URI = process.env.USER_MONGO_URI || 'mongodb://localhost:27017/campusconnect_user';

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to User MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { _id: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ id }, { _id: 0 });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/users', async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const max = await User.findOne().sort({ id: -1 });
    const nextId = max ? max.id + 1 : 1;
    const newUser = new User({ id: nextId, name: req.body.name, email: req.body.email });
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const updated = await User.findOneAndUpdate(
      { id }, { name: req.body.name, email: req.body.email },
      { new: true, runValidators: true, projection: { _id: 0 } }
    );
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await User.deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
