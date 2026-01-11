import pool from "../config/db.js";


export const getProductos = async (_, res) => {
  const result = await pool.query(`
    SELECT p.*, c.nombre AS categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
  `);
  res.json(result.rows);
};

export const createProducto = async (req, res) => {
  const { id, nombre, descripcion, precio, stock_actual, categoria_id } = req.body;

  await pool.query(
    `INSERT INTO productos VALUES ($1,$2,$3,$4,$5,$6)`,
    [id, nombre, descripcion, precio, stock_actual, categoria_id]
  );

  res.json({ message: "Producto creado" });
};

export const updateProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria_id } = req.body;

  await pool.query(
    `UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, categoria_id=$4 WHERE id=$5`,
    [nombre, descripcion, precio, categoria_id, req.params.id]
  );

  res.json({ message: "Producto actualizado" });
};

export const deleteProducto = async (req, res) => {
  await pool.query("DELETE FROM productos WHERE id=$1", [req.params.id]);
  res.json({ message: "Producto eliminado" });
};

// controllers/productos.controller.js
export const listProductosSelect = async (_, res) => {
  try {
    const result = await pool.query("SELECT id, nombre FROM productos ORDER BY nombre");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar productos" });
  }
};
