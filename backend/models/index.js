const sequelize = require('../config/database');
const User = require('./User');
const Rubro = require('./Rubro');
const Debt = require('./Debt');
const Payment = require('./Payment');

// Definir relaciones
User.hasMany(Debt, { foreignKey: 'userId', as: 'debts' });
Debt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Rubro.hasMany(Debt, { foreignKey: 'rubroId', as: 'debts' });
Debt.belongsTo(Rubro, { foreignKey: 'rubroId', as: 'rubro' });

Debt.hasMany(Payment, { foreignKey: 'debtId', as: 'payments' });
Payment.belongsTo(Debt, { foreignKey: 'debtId', as: 'debt' });

module.exports = {
  sequelize,
  User,
  Rubro,
  Debt,
  Payment,
};
