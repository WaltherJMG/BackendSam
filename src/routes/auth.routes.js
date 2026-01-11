import { Router } from "express";
import { register, login, list_user } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/list-user", list_user);
export default router;
