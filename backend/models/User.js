const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tieneDiscapacidad: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  porcentajeDiscapacidad: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  tipoDiscapacidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigos: {
    type: DataTypes.JSON, // Array of CodeItem
    allowNull: false,
    defaultValue: [],
  },
  documents: {
    type: DataTypes.JSON, // Array of UserDocument
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'users',
});

module.exports = User;
