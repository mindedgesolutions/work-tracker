import { Router } from "express";
const router = Router();
import { validateUser } from "../middleware/userMiddleware.js";
import {
  addNewUser,
  deleteUser,
  editUserDetails,
  getUserWithPagination,
} from "../controller/userController.js";

router
  .route(`/users`)
  .post(validateUser, addNewUser)
  .get(getUserWithPagination);
router
  .route(`/users/:id`)
  .patch(validateUser, editUserDetails)
  .delete(deleteUser);

export default router;
