import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Create a new product
router.post('/products', async (req, res) => {
  const { price, expense, transactions, name } = req.body;
  const newProduct = new Product({ price, expense, name, transactions });

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update a product by ID
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { price, expense, transactions, name } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { price, expense, transactions, name },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by ID
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
