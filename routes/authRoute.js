import { Router } from "express";
const router = Router();
import {
  loggedInUserInfo,
  login,
  logout,
} from "../controller/authController.js";
import { validateLogin } from "../middleware/authMiddleware.js";
import { protectRoute } from "../middleware/protectRouteMiddleware.js";

router.post(`/login`, validateLogin, login);
router.get(`/logout`, protectRoute, logout);
router.get(`/user`, protectRoute, loggedInUserInfo);

export default router;
