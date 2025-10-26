// ===============================
// Importar dependencias
// ===============================
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

// Configuración de dotenv solo en desarrollo
dotenv.config();

// ===============================
// Importar middlewares y rutas
// ===============================
import middlewares from '../middlewares/index.js';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import verificacionRoutes from '../routes/verificacionRoutes.js';
import productosRoutes from '../routes/productosRoutes.js';
import categoriasRoutes from '../routes/categoriasRoutes.js';
import carritoRoutes from '../routes/carritoRoutes.js';
import serviciosRoutes from '../routes/serviciosRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';
import clienteRoutes from '../routes/clienteRoutes.js';
import productoReportesRoutes from '../routes/productoReportesRoutes.js';
import inventarioRoutes from '../routes/inventarioRoutes.js';
import servicioReportesRoutes from '../routes/servicioReportesRoutes.js';
import logsRoutes from '../routes/logsRoutes.js';
import citasRoutes from '../routes/citasRoutes.js';
import ventasRoutes from '../routes/ventasRoutes.js';

// ===============================
// Crear instancia de Express
// ===============================
const app = express();
const PORT = process.env.PORT || 4000;

// ===============================
// CONFIGURACIÓN DE MIDDLEWARES
// ===============================
app.use(middlewares.security.helmetConfig);
app.use(cors(middlewares.security.corsConfig));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));
app.use(middlewares.security.sanitizeInput);

// ===============================
// CONEXIÓN A MYSQL
// ===============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de conexión al iniciar
db.getConnection()
  .then(conn => {
    console.log('✅ Conectado a MySQL correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err);
  });

// Exportar pool para usar en otros módulos
export { db };

// ===============================
// RUTAS PRINCIPALES
// ===============================
app.get('/', (req, res) => {
  res.json({
    mensaje: '🟢 API del Salón Sandra Fajardo funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      productos: '/api/productos',
      carrito: '/api/carrito',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      verificacion: '/api/verificacion',
      auth: '/api/auth',
      admin: '/api/admin',
      citas: '/api/citas',
      stock: '/api/stock'
    }
  });
});

// ===============================
// RUTA LOGIN ADMIN
// ===============================
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, mensaje: 'Email y contraseña son requeridos' });

    const adminEmail = 'admin@nuevatienda.com';
    const adminPassword = 'password';

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ id: 1, email: adminEmail, rol: 'admin' }, process.env.JWT_SECRET || 'salon_sandra_secret_key', { expiresIn: '24h' });

      return res.json({
        success: true,
        mensaje: 'Login exitoso',
        token,
        usuario: { id: 1, email: adminEmail, nombre: 'Administrador', rol: 'admin' }
      });
    } else {
      return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('❌ Error en login de admin:', error);
    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
  }
});

// ===============================
// RUTAS DE API
// ===============================
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/verificacion', verificacionRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/productos/reportes', productoReportesRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/servicios/reportes', servicioReportesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/clientes', clienteRoutes);

// ===============================
// INICIALIZACIÓN DEL SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(🚀 Servidor Backend corriendo en el puerto ${PORT});
  console.log(📱 API disponible en /api);
  console.log(🔧 Entorno: ${process.env.NODE_ENV || 'development'});
  console.log('✅ Usuario administrador: admin@nuevatienda.com');
  console.log('🔑 Contraseña: password');
});

// ===============================
// EXPORTACIÓN
// ===============================
export default app;
