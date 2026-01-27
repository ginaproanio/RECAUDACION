const sequelize = require('../config/database');
const User = require('./User');
const Rubro = require('./Rubro');
const Debt = require('./Debt');

// Definir relaciones
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Debt, { foreignKey: 'userId', as: 'debts' });
Debt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Rubro.hasMany(Debt, { foreignKey: 'rubroId', as: 'debts' });
Debt.belongsTo(Rubro, { foreignKey: 'rubroId', as: 'rubro' });

module.exports = {
  sequelize,
  User,
  Payment,
  Rubro,
  Debt,
};
