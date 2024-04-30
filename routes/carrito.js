const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Rutas para Clientes
router.get('/listar/:cedula', protegerRuta(["C"]), carritoController.obtenerCarrito);
router.post('/agregarProducto', protegerRuta(["C"]), carritoController.crearCarritoYagregarProducto);
router.post('/eliminarId', protegerRuta(["C"]), carritoController.eliminarInventariodelCarritoPorId);
router.delete('/eliminarTodo/:id', protegerRuta(["C"]), carritoController.eliminarTodosInventariodelCarrito);

module.exports = router;