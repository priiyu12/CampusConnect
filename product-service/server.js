const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 3002;
const MONGO_URI = process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27017/campusconnect_product';

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to Product MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findOne({ id }, { _id: 0 });
    if (product) res.status(200).json(product);
    else res.status(404).json({ error: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/products', async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const max = await Product.findOne().sort({ id: -1 });
    const nextId = max ? max.id + 1 : 1;
    const newProduct = new Product({ id: nextId, name: req.body.name, price: req.body.price });
    await newProduct.save();
    res.status(201).json(newProduct.toObject());
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const updated = await Product.findOneAndUpdate(
      { id }, { name: req.body.name, price: req.body.price },
      { new: true, runValidators: true, projection: { _id: 0 } }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Product.deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Product not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
