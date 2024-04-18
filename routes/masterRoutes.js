import { Router } from "express";
const router = Router();
import {
  addNewRole,
  deleteRole,
  getAllRoles,
  getRoleWithPagination,
  updateRole,
} from "../controller/masters/roleController.js";
import {
  validateProject,
  validateRole,
} from "../middleware/masterMiddleware.js";
import {
  addNewProject,
  deleteProject,
  getAllProjects,
  getProjectWithPagination,
  updateProject,
} from "../controller/masters/projectController.js";

router.get(`/all-roles`, getAllRoles);
router
  .route(`/roles`)
  .get(getRoleWithPagination)
  .post(validateRole, addNewRole);
router.route(`/roles/:id`).patch(validateRole, updateRole).delete(deleteRole);

router.get(`/all-projects`, getAllProjects);
router
  .route(`/projects`)
  .get(getProjectWithPagination)
  .post(validateProject, addNewProject);
// .post(addNewProject);
router.route(`/projects/:id`).patch(updateProject).delete(deleteProject);

export default router;
