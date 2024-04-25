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
  validateMenu,
  validatePermission,
  validateProject,
  validateProjectContact,
  validateRole,
} from "../middleware/masterMiddleware.js";
import {
  addNewProject,
  deleteProject,
  getAllProjects,
  getProjectWithPagination,
  projectContact,
  updateProject,
} from "../controller/masters/projectController.js";
import {
  addNewPermission,
  assignPermissionToRole,
  assignPermissionToUser,
  deletePermission,
  getAllPermissions,
  getPermissionWithPagination,
  updatePermission,
} from "../controller/masters/permissionController.js";
import {
  addNewMenu,
  getAllMenus,
  getMenuWithPagination,
  updateMenu,
} from "../controller/masters/menuController.js";
import { getAllPriority } from "../controller/masters/priorityController.js";

router.get(`/all-roles`, getAllRoles);
router
  .route(`/roles`)
  .get(getRoleWithPagination)
  .post(validateRole, addNewRole);
router.route(`/roles/:id`).patch(validateRole, updateRole).delete(deleteRole);

router.get(`/all-projects`, getAllProjects);
router.post(`/validate-contact`, validateProjectContact, projectContact);
router
  .route(`/projects`)
  .get(getProjectWithPagination)
  .post(validateProject, addNewProject);
router
  .route(`/projects/:id`)
  .patch(validateProject, updateProject)
  .delete(deleteProject);

router.get(`/all-permissions`, getAllPermissions);
router
  .route(`/permissions`)
  .get(getPermissionWithPagination)
  .post(validatePermission, addNewPermission);
router
  .route(`/permissions/:id`)
  .patch(updatePermission)
  .delete(deletePermission);
router.post(`/role-permissions`, assignPermissionToRole);
router.post(`/user-permissions`, assignPermissionToUser);

router.get(`/all-menus`, getAllMenus);
router
  .route(`/menus`)
  .get(getMenuWithPagination)
  .post(validateMenu, addNewMenu);
router.patch(`/menus/:id`, updateMenu);

router.get(`/priorities`, getAllPriority);

export default router;
