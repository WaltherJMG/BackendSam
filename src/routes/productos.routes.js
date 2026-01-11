import { Router } from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  listProductosSelect
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", getProductos);
router.post("/", createProducto);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);
router.get("/select", listProductosSelect);

export default router;
