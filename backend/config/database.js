const { Sequelize } = require('sequelize');
require('dotenv').config();

// AUDITORÍA DE DISEÑO: Se elimina la divergencia entre SQLite y PostgreSQL.
// El sistema DEBE usar PostgreSQL en todos los entornos (desarrollo, pruebas, producción)
// para garantizar la consistencia y prevenir errores en el despliegue.
// La conexión se basa exclusivamente en la variable de entorno DATABASE_URL.

if (!process.env.DATABASE_URL) {
  throw new Error('[Error de Arquitectura] La variable de entorno DATABASE_URL es obligatoria.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    // En producción (o cualquier entorno con SSL), se requiere esta configuración.
    // Para desarrollo local sin SSL, Sequelize es lo suficientemente inteligente para ignorarlo.
    ssl: {
      require: true,
      rejectUnauthorized: false, // Requerido para conexiones a servicios como Railway/Heroku
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = sequelize;
