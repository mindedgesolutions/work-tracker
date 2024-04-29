import { Router } from "express";
const router = Router();
import {
  addNewTask,
  deleteTask,
  getTaskWithPaginationAdmin,
  getTaskWithPaginationLead,
  getTaskWithPaginationUser,
  taskAssignee,
  updateTask,
} from "../controller/taskController.js";
import {
  validateTask,
  validateTaskAssign,
} from "../middleware/taskMiddleware.js";

router.post(`/tasks`, validateTask, addNewTask);
router.get(`/admin`, getTaskWithPaginationAdmin);
router.get(`/lead`, getTaskWithPaginationLead);
router.get(`/user`, getTaskWithPaginationUser);
router.route(`/tasks/:id`).patch(validateTask, updateTask).delete(deleteTask);
router.post(`/validate-assignee`, validateTaskAssign, taskAssignee);

export default router;
