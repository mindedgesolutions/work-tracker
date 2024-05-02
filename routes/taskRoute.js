import { Router } from "express";
const router = Router();
import {
  activateTask,
  addNewTask,
  deleteTask,
  editTask,
  getTaskWithPaginationAdmin,
  getTaskWithPaginationLead,
  getTaskWithPaginationUser,
  taskAllData,
  taskAssignee,
  taskRemarks,
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
router.route(`/tasks/:id`).get(editTask).delete(deleteTask);
router.patch(`/tasks/:uuid`, validateTask, updateTask);
router.get(`/all-data/:uuid`, taskAllData);
router.get(`/task-remarks/:uuid`, taskRemarks);
router.post(`/validate-assignee`, validateTaskAssign, taskAssignee);
router.post(`/activate-task/:id`, activateTask);

export default router;
