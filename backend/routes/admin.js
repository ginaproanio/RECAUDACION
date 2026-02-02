const express = require('express');
const { Op } = require('sequelize'); // Importar Op para operadores
const { User, Rubro, Debt } = require('../models');
const router = express.Router();

// Generar deudas masivas
router.post('/generate-debts', async (req, res) => {
  try {
    const { rubroId, alcance, periodoMes, periodoAnio, codigoEspecifico } = req.body;
    const rubro = await Rubro.findByPk(rubroId);
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' });

    let users = [];
    if (alcance === 'todos') {
      users = await User.findAll();
    } else if (alcance === 'codigo') {
      // Busca usuarios que contengan el código específico en su JSON de 'codigos'
      // Esta es una consulta específica de PostgreSQL para JSONB
      users = await User.findAll({ where: { codigos: { [Op.contains]: [{ valor: codigoEspecifico }] } } });
    }

    const debts = [];
    for (const user of users) {
      for (const codigo of user.codigos) {
        // Calcular descuento
        const edad = new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear();
        const aplicaDescuento = rubro.aplicaDescuento && (edad >= 65 || user.tieneDiscapacidad);
        const porcentajeDescuento = aplicaDescuento ? rubro.porcentajeDescuento : 0;
        const descuentoValor = (rubro.montoDefecto * porcentajeDescuento) / 100;
        const montoFinal = rubro.montoDefecto - descuentoValor;

        // Verificar duplicado
        const existing = await Debt.findOne({
          where: {
            userId: user.id,
            rubroId,
            periodoMes: periodoMes,
            periodoAnio: periodoAnio,
            codigoValor: codigo.valor
          },
        });
        if (!existing) {
          debts.push({
            userId: user.id,
            rubroId,
            periodoMes: periodoMes,
            periodoAnio: periodoAnio,
            montoBase: rubro.montoDefecto,
            porcentajeDescuentoAplicado: porcentajeDescuento,
            descuentoValor,
            montoFinal,
          });
        }
      }
    }

    const createdDebts = await Debt.bulkCreate(debts);
    res.status(201).json(createdDebts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
