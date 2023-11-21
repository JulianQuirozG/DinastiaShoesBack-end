const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const { upload } = require('../config/multer');

const app = express()

// Rutas para Clientes
router.post('/subirImagen/:producto', upload.array('image', 5), fotoController.uploadToFirebaseAndSaveLink);
router.get('/listar', fotoController.obtenerLinkImagenes);
router.get('/listar/:producto', fotoController.obtenerLinkImagenesById)

module.exports = router;