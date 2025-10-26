import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Crear pool de conexiones para mejor manejo
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), // ✅ AHORA SÍ USANDO EL PUERTO DE RAILWAY
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // ✅ Railway requiere SSL en muchos casos
  },
  connectTimeout: 10000
});

// Probar la conexión
async function testConnection() {
  try {
    console.log("🔄 Intentando conectar a MySQL...");
    console.log("📍 Host:", process.env.DB_HOST);
    console.log("🔌 Puerto:", process.env.DB_PORT);
    console.log("👤 Usuario:", process.env.DB_USER);
    console.log("🗄 BD:", process.env.DB_NAME);

    const connection = await db.getConnection();
    console.log("✅ Conexión a MySQL exitosa");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL");
    console.error("   Código:", error.code);
    console.error("   Mensaje:", error.message);
  }
}

testConnection();

export { db };