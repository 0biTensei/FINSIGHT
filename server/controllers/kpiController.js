import KPI from "../models/KPI.js";

// Create a new KPI
export const createKpi = async (req, res) => {
  const { totalProfit, totalRevenue, totalExpenses, expensesByCategory, monthlyData, dailyData } = req.body;
  const newKPI = new KPI({ totalProfit, totalRevenue, totalExpenses, expensesByCategory, monthlyData, dailyData });
  
  try {
    await newKPI.save();
    res.status(201).json(newKPI);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read all KPIs
export const readKpis = async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a KPI by ID
export const updateKpi = async (req, res) => {
  const { id } = req.params;
  const { totalProfit, totalRevenue, totalExpenses, expensesByCategory, monthlyData, dailyData } = req.body;

  try {
    const updatedKPI = await KPI.findByIdAndUpdate(id, { totalProfit, totalRevenue, totalExpenses, expensesByCategory, monthlyData, dailyData }, { new: true });
    res.status(200).json(updatedKPI);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a KPI by ID
export const deleteKpi = async (req, res) => {
  const { id } = req.params;

  try {
    await KPI.findByIdAndDelete(id);
    res.status(200).json({ message: "KPI deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
