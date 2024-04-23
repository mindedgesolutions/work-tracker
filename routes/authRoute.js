import { Router } from "express";
const router = Router();
import { login } from "../controller/authController.js";
import { validateLogin } from "../middleware/authMiddleware.js";

router.post(`/login`, validateLogin, login);

export default router;
