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


module.exports = {
    uploadToFirebaseAndSaveLink,
};