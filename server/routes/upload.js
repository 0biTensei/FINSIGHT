import express from 'express';
import User from '../models/User.js';
import upload from '../middlewares/upload.js';
import xlsx from 'xlsx';
import KPI from '../models/KPI.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Month from '../models/Month.js';

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    let data = {
      kpis: {},
      monthly: {},
      products: {},
      transactions: {},
    };

    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const [
        KpiSheetName,
        MonthlyDataSheetName,
        ProductsSheetName,
        TransactionsSheetName,
        expensesByCategorySheetName,
      ] = workbook.SheetNames;

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];

        if (sheetName === KpiSheetName) {
          data.kpis = xlsx.utils.sheet_to_json(worksheet);
          data.kpis = data.kpis.map((k) => {
            return {
              ...k,
              totalProfit: k.totalProfit * 100,
              totalRevenue: k.totalRevenue * 100,
              totalExpenses: k.totalExpenses * 100,
            };
          });
        } else if (sheetName === MonthlyDataSheetName) {
          data.monthly = xlsx.utils.sheet_to_json(worksheet);
          data.monthly = data.monthly.map((m) => {
            return {
              ...m,
              revenue: m.revenue * 100,
              expenses: m.expenses * 100,
              operationalExpenses: m.operationalExpenses * 100,
              nonOperationalExpenses: m.nonOperationalExpenses * 100,
            };
          });
          data.kpis[0].monthlyData = data.monthly;
        } else if (sheetName === ProductsSheetName) {
          const json_data = xlsx.utils.sheet_to_json(worksheet);
          console.log(json_data);
          data.products = json_data.map((p) => {
            console.log(typeof JSON.parse(p.transactions));
            return {
              ...p,
              price: p.price * 100,
              expense: p.expense * 100,
              transactions: JSON.parse(p.transactions),
            };
          });
        } else if (sheetName === TransactionsSheetName) {
          const json_data = xlsx.utils.sheet_to_json(worksheet);
          data.transactions = json_data.map((d) => {
            return {
              ...d,
              amount: d.amount * 100,
              productIds: JSON.parse(d.productIds),
            };
          });
        } else if (sheetName === expensesByCategorySheetName) {
          const json_data = xlsx.utils.sheet_to_json(worksheet);
          console.log('expenses', json_data);
          data.kpis[0].expensesByCategory = json_data.map((e) => {
            return {
              ...e,
              salaries: e.salaries * 100,
              supplies: e.supplies * 100,
              services: e.services * 100,
            };
          })[0];
        }
      }
    }

    await KPI.deleteMany({});
    await Product.deleteMany({});
    await Transaction.deleteMany({});

    await KPI.insertMany(data.kpis);
    await Product.insertMany(data.products);

    for (const txn of data.transactions) {
      const proper_ids = [];
      for (const product_id of txn.productIds) {
        console.log('finding product-id', product_id);
        const p = await Product.findOne({ id: product_id }).exec();

        console.log('found product:', p._id);
        proper_ids.push(p._id);
      }

      const newTxn = new Transaction(txn);
      newTxn.productIds = proper_ids;
      newTxn.save();
    }

    return res.status(200).json({ data: data });
  } catch (ex) {
    console.log(JSON.stringify(ex, null, 2));
    return res.status(500).json({ message: ex.message });
  }
});

export default router;
