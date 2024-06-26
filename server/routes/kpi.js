import express from "express";
import { createKpi, readKpis, updateKpi, deleteKpi } from "../controllers/kpiController.js";

const router = express.Router();

router.post("/kpis", createKpi);
router.get("/kpis", readKpis);
router.put("/kpis/:id", updateKpi);
router.delete("/kpis/:id", deleteKpi);

export default router;
