const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const categoriaController = require('../controllers/CategoriaController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Rutas para Clientes
router.get('/listar', categoriaController.obtenerCategoria);
router.get('/obtener/:id', categoriaController.obtenerUnaCategoria);
router.put('/crear/', protegerRuta(["A","E"]), categoriaController.crearCategoria);
router.delete('/eliminar/:id', protegerRuta(["A","E"]), categoriaController.eliminarCategoriaPorId);
router.patch('/actualizar/:id', protegerRuta(["A","E"]), categoriaController.actualizarCategoriaPorId);
router.get('/filtrar',categoriaController.obtenerCategoriaFiltrada);
module.exports = router;