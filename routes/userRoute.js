import { Router } from "express";
const router = Router();
import { validateUser } from "../middleware/userMiddleware.js";
import {
  addNewUser,
  deleteUser,
  editUserDetails,
  getAllUserId,
  getUserWithPagination,
} from "../controller/userController.js";
import { activateUser } from "../controller/masters/permissionController.js";

router
  .route(`/users`)
  .post(validateUser, addNewUser)
  .get(getUserWithPagination);
router
  .route(`/users/:id`)
  .patch(validateUser, editUserDetails)
  .delete(deleteUser);
router.patch(`/users/activate/:id`, activateUser);
router.get(`/user-id`, getAllUserId);

export default router;
