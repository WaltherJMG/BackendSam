import pool from "../config/db.js";


export const getCategorias = async (_, res) => {
  const result = await pool.query("SELECT * FROM categorias");
  res.json(result.rows);
};

export const createCategoria = async (req, res) => {
  const { id, nombre, descripcion } = req.body;

  await pool.query(
    "INSERT INTO categorias VALUES ($1,$2,$3)",
    [id, nombre, descripcion]
  );

  res.json({ message: "Categoría creada" });
};

export const updateCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const { id } = req.params;

  await pool.query(
    "UPDATE categorias SET nombre=$1, descripcion=$2 WHERE id=$3",
    [nombre, descripcion, id]
  );

  res.json({ message: "Categoría actualizada" });
};

export const deleteCategoria = async (req, res) => {
  await pool.query("DELETE FROM categorias WHERE id=$1", [req.params.id]);
  res.json({ message: "Categoría eliminada" });
};
