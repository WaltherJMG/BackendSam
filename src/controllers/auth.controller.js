import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES ($1,$2,$3)",
    [nombre, email, hash]
  );

  res.json({ message: "Usuario registrado" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM usuarios WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    "secreto",
    { expiresIn: "8h" }
  );

  res.json({ token });
};


export const list_user = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, nombre FROM usuarios ORDER BY nombre`);
    res.json(result.rows); // [{id:1,nombre:'Juan'}, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

