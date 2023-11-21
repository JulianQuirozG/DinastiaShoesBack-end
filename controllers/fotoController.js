const Foto = require('../models/fotoModel'); // Asegúrate de tener el modelo Foto configurado correctamente
const { uploadFile } = require('../util/adminFirebase');

const uploadToFirebaseAndSaveLink = async (req, res) => {

    try {
        const producto = req.params.producto;
        const image = req.files;

        if (image && image.length > 0) {

            const uploadImagesP = image.map(async (images) => {

                const { ref, downloadURL } = await uploadFile(images);

                if (producto) {

                    const foto = await Foto.create({
                        url_foto: downloadURL,
                        producto_codigo: producto
                    });

                    return { foto };
                }

            });

            const respuesta = await Promise.all(uploadImagesP);
            return res.json(respuesta);


        } else {
            console.error('Debes agregar una imagen');
            res.status(500).json({ error: 'Error al agregar una imagen' });
        }
    }
    catch (error) {
        console.error('Error en la carga de la imagen:', error);
        res.status(500).json({ error: 'Error en la carga de la imagen' });
    }

};

async function obtenerLinkImagenes(req, res) {
    try {
        const foto = await Foto.findAll();
        res.json(foto);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}

async function obtenerLinkImagenesById(req, res) {
    try {
        const { producto } = req.params;
        const foto = await Foto.findAll({
            where:{
                producto_codigo: producto
            }});
        res.json(foto);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}



module.exports = {
    uploadToFirebaseAndSaveLink,
    obtenerLinkImagenes,
    obtenerLinkImagenesById

};