const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors());

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Allyson22194_",  // Contraseña proporcionada
    database: "mi_proyecto"     // Nombre de la base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

// Ruta para obtener las coordenadas y la variable cambiante más reciente
app.get("/coordenadas-cambiantes", (req, res) => {
    const query = "SELECT latitud, longitud, timestamp, variable_cambiante FROM coordenadas ORDER BY id DESC LIMIT 1";

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener datos:", err);
            res.status(500).json({ error: "Error al obtener datos" });
        } else {
            if (results.length > 0) {
                const data = results[0];
                res.json({
                    latitud: parseFloat(data.latitud).toFixed(5),
                    longitud: parseFloat(data.longitud).toFixed(5),
                    timestamp: data.timestamp,
                    variable_cambiante: data.variable_cambiante  // Aquí agregamos la variable cambiante
                });
            } else {
                res.json({});
            }
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
