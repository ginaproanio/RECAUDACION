const express = require('express');
const router = express.Router();

// Placeholder for rubros routes
router.get('/', (req, res) => {
  res.json({ message: 'Rubros endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Rubro created' });
});

module.exports = router;
