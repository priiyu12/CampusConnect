const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
const MONGO_URI = process.env.ORDER_MONGO_URI || 'mongodb://localhost:27017/campusconnect_order';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to Order MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }
}, { versionKey: false });

const Order = mongoose.model('Order', orderSchema);

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}, { _id: 0 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await Order.findOne({ id }, { _id: 0 });
    if (order) res.status(200).json(order);
    else res.status(404).json({ error: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    // Service-to-Service communication to validate User
    try {
      await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ error: "Invalid User ID: User not found" });
      }
      return res.status(503).json({ error: "User Service Unavailable" });
    }

    // Service-to-Service communication to validate Product
    try {
      await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ error: "Invalid Product ID: Product not found" });
      }
      return res.status(503).json({ error: "Product Service Unavailable" });
    }

    const max = await Order.findOne().sort({ id: -1 });
    const nextId = max ? max.id + 1 : 1;
    const newOrder = new Order({ id: nextId, userId, productId, quantity: quantity || 1 });
    await newOrder.save();
    res.status(201).json(newOrder.toObject());
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
