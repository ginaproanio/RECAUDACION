const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Debt = sequelize.define('Debt', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  rubroId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rubros',
      key: 'id',
    },
  },
  codigoValor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Normalized period fields (replaces periodoLabel, monthIndex, year)
  periodoMes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 11 }, // 0=Enero, 11=Diciembre
  },
  periodoAnio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 2020, max: 2030 },
  },
  montoBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  porcentajeDescuentoAplicado: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  descuentoValor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  montoFinal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado'),
    defaultValue: 'pendiente',
  },
  // Payment fields
  payphoneTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  comprobanteUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'debts',
  indexes: [
    { fields: ['userId', 'estado'] },
    { fields: ['periodoMes', 'periodoAnio'] },
    { unique: true, fields: ['userId', 'rubroId', 'codigoValor', 'periodoMes', 'periodoAnio'] }
  ]
});

module.exports = Debt;
