const express = require('express')
const morgan = require('morgan')
const router = express.Router();
const medioController = require('../controllers/mediosDePagoController');
const { upload } = require('../config/multer');

const app = express()

// Rutas para Clientes
router.post('/subirImagen', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'qr', maxCount: 1 }]), medioController.uploadToFirebaseAndSaveLink);
router.post('/editar', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'qr', maxCount: 1 }]), medioController.updateToFirebaseAndSaveLink);
router.get('/listar', medioController.obtenerLinkImagenes);
router.get('/obtener/:id', medioController.obtenerLinkImagenesById);
router.delete('/eliminar/:id', medioController.eliminarImagenes);

module.exports = router;