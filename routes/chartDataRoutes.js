import { Router } from "express";
const router = Router();
import {
  adminRemarkChartPie,
  adminTaskChartBar,
} from "../controller/chartData/adminChart.js";

router.get(`/admin/task-bar`, adminTaskChartBar);
router.get(`/admin/remark-pie/:task`, adminRemarkChartPie);

export default router;
