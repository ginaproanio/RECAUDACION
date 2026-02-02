const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Obtener documentos de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.documents || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar lista de documentos (Metadata)
router.post('/user/:userId', async (req, res) => {
  try {
    const { documents } = req.body; // Array de objetos documento
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.documents = documents;
    await user.save();
    res.json(user.documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;