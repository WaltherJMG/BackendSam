import { Router } from "express";
import {
  createMovimiento,
  getMovimientos,
  deleteMovimiento,
  updateMovimiento,
} from "../controllers/movimientos.controller.js";

const router = Router();

router.get("/", getMovimientos);
router.post("/", createMovimiento);
router.delete("/:id", deleteMovimiento);
router.put("/:id", updateMovimiento);

export default router;
