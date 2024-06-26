import KPI from '../models/KPI.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const createData = async (req, res) => {
  try {
    const newData = new DataModel(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const readData = async (req, res) => {
  try {
    const data = await DataModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateData = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const data = await DataModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteData = async (req, res) => {
  const { id } = req.params;
  try {
    await DataModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
