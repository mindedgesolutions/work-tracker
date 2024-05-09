import { Router } from "express";
const router = Router();
import {
  addRemark,
  deleteRemark,
  taskRemarks,
  taskRemarksAll,
  updateRemark,
} from "../controller/remarkController.js";
import { validateRemark } from "../middleware/remarkMiddleware.js";

router.route(`/remarks/:uuid`).get(taskRemarks).post(validateRemark, addRemark);
router
  .route(`/remarks/:id`)
  .patch(validateRemark, updateRemark)
  .delete(deleteRemark);
router.get(`/all-remarks/:uuid`, taskRemarksAll);

export default router;
