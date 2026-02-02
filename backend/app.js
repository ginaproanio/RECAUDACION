const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const debtRoutes = require('./routes/debts');
const paymentRoutes = require('./routes/payments');
const rubroRoutes = require('./routes/rubros');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');

// Inicializar la aplicación Express
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rubros', rubroRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de errores global (Middleware final)
app.use((err, req, res, next) => {
  console.error('❌ [Error Global]:', err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor.', details: err.message });
});

// Healthcheck para Railway
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// AUDITORÍA DE DESARROLLO: Verificación de Conexión a Base de Datos
const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ [Database] Conexión establecida correctamente.');
  } catch (error) {
    console.error('❌ [Database] Error crítico de conexión:', error.message);
  }
};

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  checkDatabaseConnection();
});

module.exports = app;
