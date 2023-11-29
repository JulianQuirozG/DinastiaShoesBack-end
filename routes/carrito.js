const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const carritoController = require('../controllers/carritoController');

const app= express()

// Rutas para Clientes
router.get('/listar/:cedula', carritoController.obtenerCarrito);

module.exports = router;