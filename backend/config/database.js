const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno
// Priorizar .env.local sobre .env para desarrollo local
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else {
  require('dotenv').config({ path: envPath });
}

// Configuración de base de datos:
// - Producción: PostgreSQL (Railway)
// - Desarrollo: PostgreSQL local (desde .env.local) o Railway

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('[Error] La variable de entorno DATABASE_URL es obligatoria. Configure una base de datos PostgreSQL.');
}

// En desarrollo, si la URL contiene railway.internal,
// intentar conectar pero mostrar mensaje informativo
const isProduction = process.env.NODE_ENV === 'production';
const isRailwayUrl = databaseUrl.includes('railway.internal');

if (!isProduction && isRailwayUrl) {
  console.log('⚠️  [Database] Usando URL de Railway en desarrollo local. Asegúrese de que sea accesible.');
  console.log('💡 Si no funciona, cree un archivo .env.local con una base de datos PostgreSQL local.');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false,
    } : false, // Deshabilitar SSL en desarrollo local
  },
  logging: isProduction ? false : console.log,
});

module.exports = sequelize;
