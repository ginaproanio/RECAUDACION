const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { cedula, nombres, apellidos, email, celular, fechaNacimiento, tieneDiscapacidad, porcentajeDiscapacidad, tipoDiscapacidad, codigos } = req.body;

    // Validaciones básicas
    if (!cedula || !nombres || !apellidos || !email || !celular || !fechaNacimiento) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
    }

    if (!codigos || codigos.length === 0) {
      return res.status(400).json({ error: 'Debe asignar al menos un código de propiedad.' });
    }

    // Verificar si usuario ya existe
    const existingUser = await User.findOne({ where: { cedula } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario con esta cédula ya existe' });
    }

    // Normalizar códigos para asegurar estructura JSONB correcta [{ valor: "..." }]
    // Si viene ["123"], lo convierte. Si ya es objeto, lo deja.
    const codigosNormalizados = codigos.map(c => (typeof c === 'string' ? { valor: c } : c));

    // Hash de contraseña (default: cédula)
    const hashedPassword = await bcrypt.hash(cedula, 12);

    const user = await User.create({
      cedula,
      password: hashedPassword,
      nombres,
      apellidos,
      email,
      celular,
      fechaNacimiento,
      tieneDiscapacidad: tieneDiscapacidad || false,
      porcentajeDiscapacidad,
      tipoDiscapacidad,
      codigos: codigosNormalizados,
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, cedula: user.cedula },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        cedula: user.cedula,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        celular: user.celular
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { cedula, password } = req.body;

    if (!cedula || !password) {
      return res.status(400).json({ error: 'Cédula y contraseña son requeridas' });
    }

    const user = await User.findOne({ where: { cedula } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, cedula: user.cedula },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        cedula: user.cedula,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        celular: user.celular,
        tieneDiscapacidad: user.tieneDiscapacidad,
        codigos: user.codigos
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token (para refresh)
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        cedula: user.cedula,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        celular: user.celular,
        tieneDiscapacidad: user.tieneDiscapacidad,
        codigos: user.codigos
      }
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
