import express from 'express';
import { createData, readData, updateData, deleteData } from '../controllers/adminController.js';

const router = express.Router();

router.post('/data', createData);
router.get('/data', readData);
router.put('/data/:id', updateData);
router.delete('/data/:id', deleteData);

export default router;
