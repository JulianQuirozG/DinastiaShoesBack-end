const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const categoriaController = require('../controllers/CategoriaController');

const app= express()

// Rutas para Clientes
router.get('/listar', categoriaController.obtenerCategoria);
router.get('/obtener/:id', categoriaController.obtenerUnaCategoria);
router.put('/crear/', categoriaController.crearCategoria);
router.delete('/eliminar/:id', categoriaController.eliminarCategoriaPorId);
router.patch('/actualizar/:id', categoriaController.actualizarCategoriaPorId);
router.get('/filtrar',categoriaController.obtenerCategoriaFiltrada);
module.exports = router;