const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const pedidoController = require('../controllers/pedidosController');
const { upload } = require('../config/multer');

const app= express()

// Rutas para Clientes
router.get('/listar', pedidoController.obtenerPedido);
router.get('/listarUsuario/:cedula', pedidoController.obtenerPedidosPorUsuario);
router.get('/obtener/:id', pedidoController.obtenerUnPedido);
router.post('/crear', upload.fields([{ name: 'comprobar', maxCount: 1 }]), pedidoController.crearPedido);
router.delete('/eliminar/:id', pedidoController.eliminarPedido);
router.post('/actualizar', pedidoController.actualizarPedidoId);

module.exports = router;