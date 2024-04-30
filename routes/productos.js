const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const productController = require('../controllers/productoControllers');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Definir rutas
router.get('/listar', productController.obtenerProductos);
router.get('/obtener/:codigo', productController.obtenerUnProducto);
router.put('/crear/', protegerRuta(["A","E"]), productController.crearProducto);
router.delete('/eliminar/:codigo', protegerRuta(["A","E"]), productController.eliminarProductoPorId);
router.patch('/actualizar/:codigo', protegerRuta(["A","E"]), productController.actualizarProductoPorId);
router.get('/filtrar/:categoria',productController.obtenerProductoFiltrado);
router.get('/listarColoresTallas', productController.obtenerTallasColoresCategorias);
router.post('/filtrarColoresTallas', productController.obtenerFiltradoTallaColor);

module.exports = router;
