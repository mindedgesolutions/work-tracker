import { Router } from "express";
const router = Router();
import { addRemark, taskRemarks } from "../controller/remarkController.js";
import { validateRemark } from "../middleware/remarkMiddleware.js";

router.route(`/remarks/:uuid`).get(taskRemarks).post(validateRemark, addRemark);

export default router;
