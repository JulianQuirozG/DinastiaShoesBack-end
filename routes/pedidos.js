const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const pedidoController = require('../controllers/pedidosController');
const protegerRuta = require('../middleware/preteccionRutas')
const { upload } = require('../config/multer');

const app= express()

// Rutas para Clientes
router.get('/listar', protegerRuta(["A","E"]), pedidoController.obtenerPedido);
router.get('/listarUsuario/:cedula', protegerRuta(["A","E","C"]), pedidoController.obtenerPedidosPorUsuario);
router.get('/obtener/:id', protegerRuta(["A","E","C"]), pedidoController.obtenerUnPedido);
router.post('/crear',protegerRuta(["C"]), upload.fields([{ name: 'comprobar', maxCount: 1 }]), pedidoController.crearPedido);
router.delete('/eliminar/:id', protegerRuta(["A","E"]), pedidoController.eliminarPedido);
router.post('/actualizar', protegerRuta(["A","E"]),pedidoController.actualizarPedidoId);

module.exports = router;