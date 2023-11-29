const express = require('express')
const morgan = require('morgan')
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

const app= express()

// Rutas para usuarios
router.get('/listar', usuarioController.obtenerUsuario);
router.get('/listarFiltrado/:filtro', usuarioController.obtenerUsuarioFiltrado);
router.get('/obtener/:cedula', usuarioController.obtenerUnUsuario);

router.get('/obtenerClientes', usuarioController.obtenerClientes);
router.get('/obtenerEmpleados', usuarioController.obtenerEmpleados);

router.post('/login', usuarioController.login);
router.put('/crearAdmin/', usuarioController.crearUsuarioAdmin);
router.put('/crearEmpleado/', usuarioController.crearUsuarioEmpleado);
router.put('/crearCliente/', usuarioController.crearUsuarioCliente);

router.delete('/eliminar/:cedula', usuarioController.eliminarUsuarioPorId);
router.patch('/actualizar/:cedula', usuarioController.actualizarUsuarioPorId);

router.post('/olvidarContra/:token', usuarioController.olvidarContraUsuario);
router.post('/cambiarContra', usuarioController.cambiarContraUsuario);
router.post('/enviarCorreo/:destinatario',usuarioController.enviarCorreoContrasenia)

router.get('/obtenerUsuarioPorToken/:token', usuarioController.obtenerUnUsuarioPorToken);

module.exports = router;
