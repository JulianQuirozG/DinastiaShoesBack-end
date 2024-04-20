const { async } = require('@firebase/util');
const { Sequelize } = require('sequelize');
const Foto = require('../models/fotoModel'); // Asegúrate de tener el modelo Foto configurado correctamente
const Inventario = require('../models/inventarioModel');
const Producto = require('../models/productoModel');
const { uploadFile, deleteFile } = require('../util/adminFirebase');

const uploadToFirebaseAndSaveLink = async (req, res) => {

    try {
        const producto = req.params.producto;
        const image = req.files;

        const fotos = await Foto.findAll({
            where: {
                inventario_codigo: producto,
            },
        });

        if (fotos.length > 0) {
            fotos.map(async (fo) => {
                fo.destroy();
            });
        }

        if (image && image.length > 0) {

            const uploadImagesP = image.map(async (images) => {

                const { ref, downloadURL } = await uploadFile(images);

                if (producto) {

                    const foto = await Foto.create({
                        url_foto: downloadURL,
                        inventario_codigo: producto
                    });

                    return { foto };
                }

            });

            const respuesta = await Promise.all(uploadImagesP);
            return res.json(respuesta);


        } else {
            console.error('Debes agregar una imagen');
            return res.status(500).json({ error: 'Error al agregar una imagen' });
        }
    }
    catch (error) {
        console.error('Error en la carga de la imagen:', error);
        return res.status(500).json({ error: 'Error en la carga de la imagen' });
    }

};

async function obtenerLinkImagenes(req, res) {
    try {
        const foto = await Foto.findAll();
        return res.json(foto);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        return res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}

async function obtenerLinkImagenesHome(req, res) {
    try {
        const foto = await Foto.findAll({
            order: Sequelize.literal('RAND()'), // Ordenar aleatoriamente
            limit: 8,
        });
        return res.json(foto);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        return res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}

async function obtenerLinkImagenesById(req, res) {
    try {
        const { producto } = req.params;
        const foto = await Foto.findAll({
            where: {
                inventario_codigo: producto
            }
        });
        return res.json(foto);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        return res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}

async function obtenerLinkImagenesByIdProducto(req, res) {
    try {
        const { producto } = req.params;
        const product = await Producto.findByPk(producto, {
            include: [
                {
                    model: Inventario,
                }
            ],
        });

        let traerImagenes = [];

        if (product.inventarios.length > 0) {
            traerImagenes = await Promise.all(product.inventarios.map(async (variante) => {
                const fotos = await Foto.findAll({
                    where: {
                        inventario_codigo: variante.codigo,
                    },
                });
                return { fotos };
            }));
        }

        return res.json(traerImagenes);
    } catch (error) {
        console.error('Error al obtener informacion las imagenes:', error);
        return res.status(500).json({ error: 'Error al obtener la informacion las imagenes.' });
    }
}

async function eliminarImagenes(req, res) {
    try {
        const { id } = req.params;
        const foto = await Foto.findByPk(id);

        if (foto) {
            const { respuesta, error } = await deleteFile(foto.url_foto);

            if (respuesta) {
                await foto.destroy(); // Elimina el producto de la base de datos
                return res.json({ mensaje: 'Imagen eliminada exitosamente' });
            } else {
                return res.status(500).json({ error: 'Error al eliminar la imagen', detalle: error });
            }
        } else {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        return res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}



module.exports = {
    uploadToFirebaseAndSaveLink,
    obtenerLinkImagenes,
    obtenerLinkImagenesById,
    eliminarImagenes,
    obtenerLinkImagenesHome,
    obtenerLinkImagenesByIdProducto

};