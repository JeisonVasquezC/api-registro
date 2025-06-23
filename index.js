const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL con Pool de Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Ruta para obtener todos los usuarios registrados
app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// Ruta para registrar datos
app.post("/registro", async (req, res) => {
  const { nombre, celular, correo } = req.body;

  try {
    const query = "INSERT INTO usuarios (nombre, celular, correo) VALUES ($1, $2, $3)";
    await pool.query(query, [nombre, celular, correo]);
    res.json({ mensaje: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Ruta para registrar usuario con método GET
// Ejemplo de uso: /registro?nombre=Juan&celular=3001234567&correo=juan@mail.com
app.get("/registro", async (req, res) => {
  const { nombre, celular, correo } = req.query;

  if (!nombre || !celular || !correo) {
    return res.status(400).json({ error: "Faltan parámetros: nombre, celular o correo" });
  }

  try {
    const query = "INSERT INTO usuarios (nombre, celular, correo) VALUES ($1, $2, $3)";
    await pool.query(query, [nombre, celular, correo]);
    res.json({ mensaje: "Usuario registrado exitosamente (GET)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el usuario con GET" });
  }
});

// Ruta para contar cuántos usuarios hay registrados
app.get("/total_usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT COUNT(*) FROM usuarios");
    const total = parseInt(resultado.rows[0].count);
    res.json({ totalUsuarios: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contar los usuarios" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
