import { Router } from "express";
const router = Router();
import {
  addRemark,
  taskRemarks,
  taskRemarksAll,
} from "../controller/remarkController.js";
import { validateRemark } from "../middleware/remarkMiddleware.js";

router.route(`/remarks/:uuid`).get(taskRemarks).post(validateRemark, addRemark);
router.get(`/all-remarks/:uuid`, taskRemarksAll);

export default router;
