const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

const app= express()

// Rutas para Clientes
router.get('/listar', empleadoController.obtenerEmpleados);
router.get('/obtener/:cedula', empleadoController.obtenerUnEmpleado);
router.put('/crear', empleadoController.crearEmpleado);
router.delete('/eliminar/:cedula', empleadoController.eliminarEmpleadoPorId);
router.patch('/actualizar/:cedula', empleadoController.actualizarEmpleadoPorId);

module.exports = router;