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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
