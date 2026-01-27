const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rubro = sequelize.define('Rubro', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  montoDefecto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  aplicaDescuento: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  porcentajeDescuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
}, {
  tableName: 'rubros',
});

module.exports = Rubro;
