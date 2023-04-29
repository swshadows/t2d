import { Router } from "express";
import UserController from "../controllers/User.controller";
const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);
router.get("/:username", UserController.getUser);

export default router;
