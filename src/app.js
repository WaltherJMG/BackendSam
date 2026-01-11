import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";

const app = express();

const port = process.env.PORT || 3000

const withelist = [
    'http://localhost:5173'
]

app.use(cors({
    origin: function (origin, callback){
        if(!origin) return callback(null, true)
        
        if(withelist.includes(origin)){
            callback(null, true)
        }else{
            console.log("Bloqueado por CORS: ", origin);
            callback(new Error('Bloqueado por CORS'))
            
        }
    }
}))
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/movimientos", movimientosRoutes);

app.listen(port, () => {
  console.log("Servidor corriendo en http://localhost:", port);
});




