const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const { upload } = require('../config/multer');
const protegerRuta = require('../middleware/preteccionRutas')

const app = express()

// Rutas para Clientes
router.post('/subirImagen/:producto', upload.array('image', 5), fotoController.uploadToFirebaseAndSaveLink);
router.get('/listar', fotoController.obtenerLinkImagenes);
router.get('/listar/:producto', fotoController.obtenerLinkImagenesById);
router.delete('/eliminar/:id', fotoController.eliminarImagenes);
router.get('/listaraleatorio',fotoController.obtenerLinkImagenesHome);
router.get('/listarProducto/:producto', fotoController.obtenerLinkImagenesByIdProducto);
module.exports = router;