const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Rutas para Clientes
router.get('/listar', protegerRuta(["A"]), clienteController.obtenerClientes);
router.get('/obtener/:cedula', protegerRuta(["A","E","C"]), clienteController.obtenerUnCliente);
router.put('/crearCliente/', clienteController.crearCliente);
router.delete('/eliminar/:cedula', protegerRuta(["A","C"]), clienteController.eliminarClientePorId);
router.patch('/actualizar/:cedula', protegerRuta(["A","C"]),clienteController.actualizarClientePorId);

module.exports = router;