const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000; // Puerto en el que corre la API

// Configuración de CORS para permitir peticiones desde el frontend
// Esto es importante si tu frontend y backend corren en puertos diferentes (ej: 5500 y 3000)
app.use(cors());

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: "localhost", // La IP o nombre del host de tu base de datos
    user: "root",     // Tu usuario de MySQL
    password: "Allyson22194_",  // Tu contraseña de MySQL
    database: "mi_proyecto"     // El nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        // Opcional: Puedes salir del proceso si la conexión a la BD es crítica
        // process.exit(1);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

// Ruta para obtener las coordenadas y las variables (velocidad, gasolina) más recientes
// Endpoint: GET http://localhost:3000/coordenadas
app.get("/coordenadas", (req, res) => {
    // Consulta para seleccionar la última fila por ID descendente
    const query = "SELECT latitud, longitud, timestamp, velocidad, gasolina FROM coordenadas ORDER BY id DESC LIMIT 1";

    // Ejecutar la consulta a la base de datos
    db.query(query, (err, results) => {
        // Manejar cualquier error durante la consulta
        if (err) {
            console.error("❌ Error al obtener datos:", err);
            res.status(500).json({ error: "Error al obtener datos" });
        } else {
            // Si se encontraron resultados (la tabla no está vacía)
            if (results.length > 0) {
                const data = results[0]; // Obtener la primera (y única) fila del resultado

                // Enviar los datos como respuesta JSON
                res.json({
                    // latitud y longitud formateadas a 5 decimales (como strings)
                    latitud: parseFloat(data.latitud).toFixed(5),
                    longitud: parseFloat(data.longitud).toFixed(5),
                    // timestamp (en el formato que venga de la base de datos)
                    timestamp: data.timestamp,
                    // velocidad y gasolina convertidas a números flotantes explícitamente
                    velocidad: parseFloat(data.velocidad), // <-- Convertido a Number
                    gasolina: parseFloat(data.gasolina)   // <-- Convertido a Number
                });
            } else {
                // Si no se encontraron resultados (la tabla está vacía), enviar un objeto JSON vacío
                res.json({});
            }
        }
    }); // Fin de db.query callback
}); // Fin de la definición de la ruta GET /coordenadas


// <-- ¡RUTA /api/config AÑADIDA/DESCOMENTADA AQUÍ!
// Ruta para obtener configuración del frontend
// Endpoint: GET http://localhost:3000/api/config
app.get("/api/config", (req, res) => {
    try {
        // Aquí defines y envías la configuración que necesite tu frontend
        // En tu HTML, el frontend espera 'pageTitle'
        const config = {
            pageTitle: "Geo Finder Rastreador", // Ejemplo de configuración
            // ... otras opciones de configuración si las necesitas ...
        };
        res.json(config);
    } catch (error) {
        console.error("❌ Error al obtener configuración:", error);
        res.status(500).json({ error: "Error al obtener configuración" });
    }
});
// --> FIN DE RUTA /api/config


// Iniciar el servidor Express para escuchar peticiones
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});