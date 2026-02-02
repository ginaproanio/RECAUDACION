'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Users
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      cedula: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombres: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fechaNacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tieneDiscapacidad: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      porcentajeDiscapacidad: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      tipoDiscapacidad: {
        type: Sequelize.STRING,
        allowNull: true
      },
      codigos: {
        type: Sequelize.JSONB, // JSONB para consultas eficientes
        allowNull: false,
        defaultValue: []
      },
      documents: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Rubros
    await queryInterface.createTable('rubros', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      montoDefecto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      aplicaDescuento: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      porcentajeDescuento: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 3. Debts
    await queryInterface.createTable('debts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      rubroId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'rubros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      codigoValor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      periodoMes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      periodoAnio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      montoBase: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      porcentajeDescuentoAplicado: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      descuentoValor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      montoFinal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'pagado'),
        defaultValue: 'pendiente'
      },
      payphoneTransactionId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      comprobanteUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // Índices para optimización y unicidad
    await queryInterface.addIndex('debts', ['userId', 'estado']);
    await queryInterface.addIndex('debts', ['periodoMes', 'periodoAnio']);
    await queryInterface.addIndex('debts', ['userId', 'rubroId', 'codigoValor', 'periodoMes', 'periodoAnio'], { unique: true });

    // 4. Payments
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      debtId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'debts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('debts');
    await queryInterface.dropTable('rubros');
    await queryInterface.dropTable('users');
  }
};