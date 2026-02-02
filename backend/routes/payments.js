const express = require('express');
const { Payment, Debt } = require('../models');
const router = express.Router();

// Obtener pagos de una deuda
router.get('/debt/:debtId', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { debtId: req.params.debtId },
      include: [{ model: Debt, as: 'debt' }]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear pago
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar pago
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Payment.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const payment = await Payment.findByPk(req.params.id);
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Pago no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar pago
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Payment.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Pago no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
