const express = require('express');
const { Debt, User } = require('../models');
const router = express.Router();

// Obtener deudas de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.params.userId },
      include: [{ model: User, as: 'user' }]
    });
    res.json(debts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear deuda
router.post('/', async (req, res) => {
  try {
    const debt = await Debt.create(req.body);
    res.status(201).json(debt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar deuda
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Debt.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const debt = await Debt.findByPk(req.params.id);
      res.json(debt);
    } else {
      res.status(404).json({ error: 'Deuda no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar deuda
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Debt.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Deuda no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
