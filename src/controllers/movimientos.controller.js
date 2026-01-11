// controllers/movimientos.controller.js
import pool from "../config/db.js";

// Registrar un movimiento
export const createMovimiento = async (req, res) => {
  try {
    let { producto_id, usuario_id, tipo, cantidad } = req.body;

    // Validaciones
    if (!producto_id || !usuario_id || !tipo || !cantidad)
      return res.status(400).json({ error: "Datos incompletos" });

    cantidad = parseInt(cantidad, 10);
    tipo = tipo.toUpperCase();

    if (isNaN(cantidad) || cantidad <= 0)
      return res.status(400).json({ error: "Cantidad inválida" });

    // Insertar movimiento
    const result = await pool.query(
      `INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [producto_id, usuario_id, tipo, cantidad]
    );

    // Actualizar stock del producto
    const operacion = tipo === "ENTRADA" ? 1 : -1;
    await pool.query(
      `UPDATE productos SET stock_actual = stock_actual + $1 WHERE id = $2`,
      [operacion * cantidad, producto_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar movimiento" });
  }
};

// Obtener todos los movimientos con usuario y producto
export const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.tipo, m.cantidad, m.fecha,
             u.id AS usuario_id, u.nombre AS usuario_nombre,
             p.id AS producto_id, p.nombre AS producto_nombre
      FROM movimientos m
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
};

export const deleteMovimiento = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener movimiento
    const mov = await pool.query("SELECT * FROM movimientos WHERE id=$1", [id]);
    if (mov.rows.length === 0) return res.status(404).json({ error: "Movimiento no encontrado" });

    // Revertir stock
    const { producto_id, tipo, cantidad } = mov.rows[0];
    const operacion = tipo === "ENTRADA" ? -1 : 1;

    // Verificar stock negativo
    const prod = await pool.query("SELECT stock_actual FROM productos WHERE id=$1", [producto_id]);
    if (prod.rows[0].stock_actual + operacion * cantidad < 0)
      return res.status(400).json({ error: "No se puede eliminar, stock insuficiente" });

    await pool.query("DELETE FROM movimientos WHERE id=$1", [id]);
    await pool.query("UPDATE productos SET stock_actual = stock_actual + $1 WHERE id=$2", [
      operacion * cantidad,
      producto_id,
    ]);

    res.json({ message: "Movimiento eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando movimiento" });
  }
};

export const updateMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    let { tipo, cantidad } = req.body;

    if (!tipo || !cantidad) return res.status(400).json({ error: "Datos incompletos" });

    tipo = tipo.toUpperCase();
    cantidad = parseInt(cantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) return res.status(400).json({ error: "Cantidad inválida" });

    // Obtener movimiento existente
    const mov = await pool.query("SELECT * FROM movimientos WHERE id=$1", [id]);
    if (mov.rows.length === 0) return res.status(404).json({ error: "Movimiento no encontrado" });

    const { producto_id, tipo: tipoAnt, cantidad: cantAnt } = mov.rows[0];

    // Revertir stock antiguo
    const revertOperacion = tipoAnt === "ENTRADA" ? -cantAnt : cantAnt;

    // Verificar stock negativo al aplicar la nueva cantidad/tipo
    const prod = await pool.query("SELECT stock_actual FROM productos WHERE id=$1", [producto_id]);
    const nuevoStock = prod.rows[0].stock_actual + revertOperacion + (tipo === "ENTRADA" ? cantidad : -cantidad);
    if (nuevoStock < 0) return res.status(400).json({ error: "No hay stock suficiente para actualizar" });

    // Actualizar movimiento
    await pool.query("UPDATE movimientos SET tipo=$1, cantidad=$2 WHERE id=$3", [tipo, cantidad, id]);

    // Aplicar stock nuevo
    const nuevaOperacion = tipo === "ENTRADA" ? cantidad : -cantidad;
    await pool.query("UPDATE productos SET stock_actual = stock_actual + $1 WHERE id=$2", [
      revertOperacion + nuevaOperacion,
      producto_id,
    ]);

    res.json({ message: "Movimiento actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando movimiento" });
  }
};