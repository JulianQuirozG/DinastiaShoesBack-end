const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const clienteController = require('../controllers/clienteController');

const app= express()

// Rutas para Clientes
router.get('/listar', clienteController.obtenerClientes);
router.get('/obtener/:cedula', clienteController.obtenerUnCliente);
router.put('/crearCliente/', clienteController.crearCliente);
router.delete('/eliminar/:cedula', clienteController.eliminarClientePorId);
router.patch('/actualizar/:cedula', clienteController.actualizarClientePorId);

module.exports = router;