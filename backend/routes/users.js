const express = require('express');
const { User, Debt } = require('../models');
const router = express.Router();

// Crear usuario manual
router.post('/', async (req, res) => {
  try {
    const { cedula, nombres, apellidos, email, celular, fechaNacimiento, tieneDiscapacidad, porcentajeDiscapacidad, tipoDiscapacidad, codigos } = req.body;
    if (!codigos || codigos.length === 0) {
      return res.status(400).json({ error: 'Debe asignar al menos un código de propiedad.' });
    }
    const user = await User.create({
      cedula,
      password: cedula, // Default password
      nombres,
      apellidos,
      email,
      celular,
      fechaNacimiento,
      tieneDiscapacidad,
      porcentajeDiscapacidad,
      tipoDiscapacidad,
      codigos,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Carga masiva CSV
router.post('/bulk', async (req, res) => {
  try {
    const { csvData } = req.body;
    const lines = csvData.split('\n');
    const users = [];
    for (const line of lines) {
      const [cedula, nombres, apellidos, email, celular, fecha, ...codigos] = line.split(',');
      users.push({
        cedula,
        password: cedula,
        nombres,
        apellidos,
        email,
        celular,
        fechaNacimiento: fecha,
        codigos: codigos.map(c => ({ valor: c })),
      });
    }
    const createdUsers = await User.bulkCreate(users);
    res.status(201).json(createdUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario (con validación de deudas)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const debts = await Debt.findAll({ where: { userId } });
    if (debts.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar usuario con deudas asociadas.' });
    }
    await User.destroy({ where: { id: userId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulación "Ver como Usuario"
router.get('/:id/simulate', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Inyectar contexto del usuario (simulación)
    res.json({ message: 'Contexto de usuario inyectado', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
