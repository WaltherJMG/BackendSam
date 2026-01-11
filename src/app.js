import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";

const app = express();

const port = process.env.PORT || 3000

// const withelist = [
//     'http://localhost:5173',
//     'https://frotend-sam.vercel.app'
// ]

app.use(cors({
  origin: 'https://frotend-sam.vercel.app', // o tu dominio frontend
  credentials: true
}))
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/movimientos", movimientosRoutes);

app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:", port);
});




