const express = require('express');
const { User, Rubro, Debt } = require('../models');
const router = express.Router();

// Generar deudas masivas
router.post('/generate-debts', async (req, res) => {
  try {
    const { rubroId, alcance, periodo, modo, inicio, fin, cantidad } = req.body;
    const rubro = await Rubro.findByPk(rubroId);
    if (!rubro) return res.status(404).json({ error: 'Rubro no encontrado' });

    let users = [];
    if (alcance === 'todos') {
      users = await User.findAll();
    } else if (alcance === 'codigo') {
      // Implementar búsqueda por código específico
      // users = await User.findAll({ where: { codigos: { [Op.contains]: [{ valor: codigoEspecifico }] } } });
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
            codigoValor: codigo.valor,
            periodoLabel: periodo,
          },
        });
        if (!existing) {
          debts.push({
            userId: user.id,
            rubroId,
            codigoValor: codigo.valor,
            periodoLabel: periodo,
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
