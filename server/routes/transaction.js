import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Create a new transaction
router.post('/transactions', async (req, res) => {
  const { buyer, amount, productIds } = req.body;
  const newTransaction = new Transaction({ buyer, amount, productIds });

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdOn: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update a transaction by ID
router.put('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { buyer, amount, productIds } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { buyer, amount, productIds },
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a transaction by ID
router.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
