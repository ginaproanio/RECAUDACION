const express = require('express');
const { Rubro, Debt } = require('../models');
const router = express.Router();

// Obtener todos los rubros
router.get('/', async (req, res) => {
  try {
    const rubros = await Rubro.findAll();
    res.json(rubros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo rubro
router.post('/', async (req, res) => {
  try {
    const rubro = await Rubro.create(req.body);
    res.status(201).json(rubro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un rubro
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Rubro.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRubro = await Rubro.findByPk(req.params.id);
      res.json(updatedRubro);
    } else {
      res.status(404).json({ error: 'Rubro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un rubro (con validación de deudas)
router.delete('/:id', async (req, res) => {
  try {
    const debts = await Debt.findOne({ where: { rubroId: req.params.id } });
    if (debts) {
      return res.status(400).json({ error: 'No se puede eliminar un rubro con deudas asociadas.' });
    }
    await Rubro.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
