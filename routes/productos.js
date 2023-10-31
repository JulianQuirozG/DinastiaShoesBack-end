const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const productController = require('../controllers/productoControllers');

const app= express()

// Definir rutas
router.get('/productos', productController.obtenerProductos);
router.get('/productos/:codigo', productController.obtenerUnProducto);
router.put('/productos/', productController.crearProducto);
router.delete('/productos/:codigo', productController.eliminarProductoPorId);
router.patch('/productos/:codigo', productController.actualizarProductoPorId);

module.exports = router;
