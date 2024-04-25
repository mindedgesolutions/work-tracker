import { Router } from "express";
const router = Router();
import {
  addNewTask,
  deleteTask,
  getTaskWithPagination,
  taskAssignee,
  updateTask,
} from "../controller/taskController.js";
import {
  validateTask,
  validateTaskAssign,
} from "../middleware/taskMiddleware.js";

router
  .route(`/tasks`)
  .get(getTaskWithPagination)
  .post(validateTask, addNewTask);
router.route(`/tasks/:id`).patch(validateTask, updateTask).delete(deleteTask);
router.post(`/validate-assignee`, validateTaskAssign, taskAssignee);

export default router;
