const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Definir rutas
router.get('/listar', inventarioController.obtenerInventarioProductos);
router.get('/obtener/:codigo', inventarioController.obtenerUnProductodelInventario);
router.put('/crear', protegerRuta(["A","E"]), inventarioController.crearInventarioProducto);
router.delete('/eliminar/:codigo', protegerRuta(["A","E"]), inventarioController.eliminarInventarioProductoPorId);
router.patch('/actualizar/:codigo', protegerRuta(["A","E"]),inventarioController.actualizarProductoPorId);
router.post('/ObtenerVariantesPorColor', inventarioController.obtenerVariantesdeProductodelInventario);

module.exports = router;
