const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const { upload } = require('../config/multer');
const protegerRuta = require('../middleware/preteccionRutas')

const app = express()

// Rutas para Clientes
router.post('/subirImagen/:producto', protegerRuta(["A","E"]), upload.array('image', 5), fotoController.uploadToFirebaseAndSaveLink);
router.get('/listar', protegerRuta(["A","E","C"]), fotoController.obtenerLinkImagenes);
router.get('/listar/:producto', protegerRuta(["A","E","C"]), fotoController.obtenerLinkImagenesById);
router.delete('/eliminar/:id', protegerRuta(["A","E"]), fotoController.eliminarImagenes);
router.get('/listaraleatorio', protegerRuta(["A","E","C"]),fotoController.obtenerLinkImagenesHome);
router.get('/listarProducto/:producto', protegerRuta(["A","E","C"]), fotoController.obtenerLinkImagenesByIdProducto);
module.exports = router;