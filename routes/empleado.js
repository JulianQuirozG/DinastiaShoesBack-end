const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const protegerRuta = require('../middleware/preteccionRutas')

const app= express()

// Rutas para Clientes
router.get('/listar', protegerRuta(["A"]), empleadoController.obtenerEmpleados);
router.get('/obtener/:cedula', protegerRuta(["A","E"]), empleadoController.obtenerUnEmpleado);
router.put('/crear', protegerRuta(["A"]), empleadoController.crearEmpleado);
router.delete('/eliminar/:cedula', protegerRuta(["A"]), empleadoController.eliminarEmpleadoPorId);
router.patch('/actualizar/:cedula', protegerRuta(["A","E"]), empleadoController.actualizarEmpleadoPorId);

module.exports = router;