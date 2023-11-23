const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

const app= express()

// Definir rutas
router.get('/listar', inventarioController.obtenerInventarioProductos);
router.get('/obtener/:codigo', inventarioController.obtenerUnProductodelInventario);
router.put('/crear', inventarioController.crearInventarioProducto);
router.delete('/eliminar/:codigo', inventarioController.eliminarInventarioProductoPorId);
router.patch('/actualizar/:codigo', inventarioController.actualizarProductoPorId);

module.exports = router;
