import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await user.comparePassword(password)) {
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save();
  
  const token = jwt.sign({ id: newUser._id }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// Update user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { email, password }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
