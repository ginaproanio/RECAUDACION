const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for local development/testing, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: console.log,
    });

module.exports = sequelize;
