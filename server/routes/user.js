import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/users/', async (req, res) => {
  try {
    let allUsers = await User.find({});
    allUsers = allUsers.map((user) => {
      return user.toJSON();
    });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/users/', async (req, res) => {
  try {
    const { email, password } = req.body;
    let newUser = new User({ email, password });
    newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const user = await User.findById(id);
    user.email = email;
    user.password = password;
    user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
