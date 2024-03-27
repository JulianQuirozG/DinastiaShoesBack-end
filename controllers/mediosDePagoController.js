const MedioDePago = require('../models/MedioDePago'); // Asegúrate de tener el modelo Foto configurado correctamente
const { uploadFile, deleteFile } = require('../util/adminFirebase');

const uploadToFirebaseAndSaveLink = async (req, res) => {

    try {
        const { logo, qr } = req.files;
        const { nombre, color, info } = req.body;
        let url_logo, url_qr;

        if (logo) {
            const { ref: refLogo, downloadURL: downloadURLLogo } = await uploadFile(logo[0]);
            url_logo = downloadURLLogo;
            console.log(downloadURLLogo);
        } else {
            console.error('Debes agregar una imagen para el logo');
            return res.status(400).json({ error: 'Debes agregar una imagen para el logo' });
        }

        if (qr) {
            const { ref: refQR, downloadURL: downloadURLQR } = await uploadFile(qr[0]);
            url_qr = downloadURLQR;
            console.log(downloadURLQR);
        }
        else {
            console.error('Debes agregar una imagen para el QR');
            return res.status(400).json({ error: 'Debes agregar una imagen para el QR' });
        }

        const medioDePago = await MedioDePago.create({
            nombre: nombre,
            logo: url_logo,
            qr: url_qr,
            color: color,
            info: info,
            eliminado: "0"
        });

        return res.json({ success: true, medioDePago });

    }
    catch (error) {
        console.error('Error en la carga de la imagen:', error);
        res.status(500).json({ error: 'Error en la carga de la imagen' });
    }

};

async function obtenerLinkImagenes(req, res) {
    try {
        const medioPago = await MedioDePago.findAll({
            where:{
                eliminado:"0"
            }
        });
        res.json(medioPago);
    } catch (error) {
        console.error('Error al obtener la información medio de pago:', error);
        res.status(500).json({ error: 'Error al obtener la información medio de pago.' });
    }
}

async function obtenerLinkImagenesById(req, res) {
    try {
        const { id } = req.params;
        const medioPago = await MedioDePago.findAll({
            where: {
                id: id
            }
        });
        res.json(medioPago);
    } catch (error) {
        console.error('Error al obtener la información medio de pago:', error);
        res.status(500).json({ error: 'Error al obtener la información medio de pago.' });
    }
}

async function eliminarImagenes(req, res) {
    try {
        const { id } = req.params;
        const medio = await MedioDePago.findByPk(id);

        if (medio) {
            if(medio.logo){
                const { respuesta: resQr, error: errorQr } = await deleteFile(medio.logo);
            } 
            if(medio.qr){
                const { respuesta: resLogo, error: errorLogo } = await deleteFile(medio.qr);
            }

            // Elimina el producto de la base de datos
            medio.eliminado="1";
            await medio.save();
            res.json({ mensaje: 'Imagenes eliminada exitosamente' });

            
        } else {
            res.status(404).json({ error: 'Imagen no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}


const updateToFirebaseAndSaveLink = async (req, res) => {

    try {
        const { logo, qr } = req.files;
        const { id, nombre, color, info } = req.body;
        let url_logo, url_qr;

        const medio = await MedioDePago.findOne({
            where: {
                id: id,
            },
        });
        if (!medio) {
            console.error('Debes agregar una imagen para el logo');
            return res.status(400).json({ error: 'Debes agregar una imagen para el logo' });
        }

        if (logo) {
            const { ref: refLogo, downloadURL: downloadURLLogo } = await uploadFile(logo[0]);
            url_logo = downloadURLLogo;
            console.log(downloadURLLogo);
        } else {
            url_logo = medio.logo;
        }

        if (qr) {
            const { ref: refQR, downloadURL: downloadURLQR } = await uploadFile(qr[0]);
            url_qr = downloadURLQR;
            console.log(downloadURLQR);
        }
        else {
            url_qr = medio.qr;
        }

        medio.nombre = nombre;
        medio.logo = url_logo;
        medio.qr = url_qr;
        medio.color = color;
        medio.info = info;
        medio.eliminado="0";

        await medio.save();
        return res.json({ success: true, medio });

    }
    catch (error) {
        console.error('Error en la carga de la imagen:', error);
        res.status(500).json({ error: 'Error en la carga de la imagen' });
    }

};




module.exports = {

    uploadToFirebaseAndSaveLink,
    obtenerLinkImagenes,
    obtenerLinkImagenesById,
    eliminarImagenes,
    updateToFirebaseAndSaveLink

};