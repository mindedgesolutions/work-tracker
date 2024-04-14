import { Router } from "express";
const router = Router();
import {
  addNewRole,
  deleteRole,
  getAllRoles,
  getRoleWithPagination,
  updateRole,
} from "../controller/masters/roleController.js";
import { validateRole } from "../middleware/masterMiddleware.js";

router.get(`/all-roles`, getAllRoles);
router
  .route(`/roles`)
  .get(getRoleWithPagination)
  .post(validateRole, addNewRole);
router.route(`/roles/:id`).patch(validateRole, updateRole).delete(deleteRole);

export default router;
