const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for local development/testing, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production');
  }
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: process.env.DATABASE_URL.includes('railway.internal') ? {} : {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
  });
}

module.exports = sequelize;
