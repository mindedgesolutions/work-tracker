import { Router } from "express";
const router = Router();
import { adminTaskChartBar } from "../controller/chartData/adminChart.js";

router.get(`/admin/task-bar`, adminTaskChartBar);

export default router;
