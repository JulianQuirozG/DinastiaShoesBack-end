const express = require('express')
const morgan = require('morgan')
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Rutas para usuarios
router.get('/listar', usuarioController.obtenerUsuario);
router.get('/listarFiltrado/:filtro', protegerRuta(["A","E"]), usuarioController.obtenerUsuarioFiltrado);
router.get('/obtener/:cedula',protegerRuta(["A","E","C"]), usuarioController.obtenerUnUsuario);

router.get('/obtenerClientes',protegerRuta(["A","E"]), usuarioController.obtenerClientes);
router.get('/obtenerEmpleados',protegerRuta(["A","E"]), usuarioController.obtenerEmpleados);

router.post('/login', usuarioController.login);
router.put('/crearAdmin/', usuarioController.crearUsuarioAdmin);
router.put('/crearEmpleado/', protegerRuta(["A"]), usuarioController.crearUsuarioEmpleado);
router.put('/crearCliente/',usuarioController.crearUsuarioCliente);

router.delete('/eliminar/:cedula',protegerRuta(["A","E"]), usuarioController.eliminarUsuarioPorId);
router.patch('/actualizar/:cedula', protegerRuta(["A","E","C"]),usuarioController.actualizarUsuarioPorId);

router.post('/olvidarContra/:token', usuarioController.olvidarContraUsuario);
router.post('/cambiarContra', usuarioController.cambiarContraUsuario);
router.post('/enviarCorreo/:destinatario', usuarioController.enviarCorreoContrasenia)

router.get('/obtenerUsuarioPorToken/:token', usuarioController.obtenerUnUsuarioPorToken);

router.post('/enviarCorreoContacto',usuarioController.enviarCorreoContactanos)

module.exports = router;
