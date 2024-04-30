const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const medioController = require('../controllers/mediosDePagoController');
const protegerRuta = require('../middleware/preteccionRutas')
const { upload } = require('../config/multer');

const app = express()

// Rutas para Clientes
router.post('/subirImagen', protegerRuta(["A"]), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'qr', maxCount: 1 }]), medioController.uploadToFirebaseAndSaveLink);
router.post('/editar', protegerRuta(["A"]), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'qr', maxCount: 1 }]), medioController.updateToFirebaseAndSaveLink);
router.get('/listar', protegerRuta(["A","E","C"]), medioController.obtenerLinkImagenes);
router.get('/obtener/:id', protegerRuta(["A","E","C"]), medioController.obtenerLinkImagenesById);
router.delete('/eliminar/:id', protegerRuta(["A"]), medioController.eliminarImagenes);

module.exports = router;