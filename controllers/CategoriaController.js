const { Fn } = require('sequelize/lib/utils');
const Categoria = require('../models/categoriaModel'); // Importa el modelo de usuario
const { Sequelize } = require('sequelize');

//Listar Categoria
async function obtenerCategoria(req, res) {
    try {
        const catego = await Categoria.findAll();
        return res.json(catego);
    } catch (error) {
        console.error('Error al obtener Categoria:', error);
        return res.status(500).json({ error: 'Error al obtener Categoria' });
    }
}

//Obtener un Categoria
async function obtenerUnaCategoria(req, res) {
    const { id } = req.params;
    try {
        const catego = await Categoria.findByPk(id);

        if (catego) {
            return res.json(catego);
        } else {
            return res.status(404).json({ error: 'No se encontró la categoria' });
        }

    } catch (error) {
        console.error('Error al obtener Categoria:', error);
        return res.status(500).json({ error: 'Error al obtener Categoria' });
    }
}

//CREAR UN PRODUCTO
async function crearCategoria(req, res) {
    const { nombre, destacado } = req.body;

    try {

        const cate = await Categoria.count({
            where: {
                destacado: "A"
            }
        });

        console.log(cate);

        if (cate && (cate => 5) && (destacado == "A")) {
            console.log("¡La cantidad maxima de categorias destacadas es 5, no puedes destacar mas categorias!")
            return res.status(500).json({ error: '¡La cantidad maxima de categorias destacadas es 5, no puedes destacar mas categorias!' });
        }

        if (nombre && destacado) {
            const nuevaCatego = await Categoria.create({
                nombre,
                destacado,
            });

            return res.json(nuevaCatego);
        } else {
            return res.status(500).json({ error: 'Los campos Están incompletos' });
        }
        // Crea una nueva categoria

    } catch (error) {
        console.error('Error al guardar la categoria:', error);
        return res.status(500).json({ error: 'Error al guardar la informacion de la categoria' });
    }
}

//ELIMINAR UN cliente
async function eliminarCategoriaPorId(req, res) {
    const { id } = req.params;

    try {
        const catego = await Categoria.findByPk(id);

        if (catego) {
            await catego.destroy(); // Elimina el producto de la base de datos
            return res.json({ mensaje: 'Informacion de la categoria eliminada exitosamente' });
        } else {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la informacion de la categoria:', error);
        return res.status(500).json({ error: 'Error al eliminar la Informacion de la categoria' });
    }
}


//actualizar por id
async function actualizarCategoriaPorId(req, res) {
    const { id } = req.params;
    const { nombre, destacado } = req.body;

    try {

        const catego = await Categoria.findByPk(id);

        if (catego) {
            // Actualiza los datos del cliente

            const cate = await Categoria.count({
                where: {
                    destacado: "A"
                }
            });

            console.log(cate);

            if (cate && (cate => 5) && (destacado == "A")) {
                console.log("¡La cantidad maxima de categorias destacadas es 5, no puedes destacar mas categorias!")
                return res.status(500).json({ error: '¡La cantidad maxima de categorias destacadas es 5, no puedes destacar mas categorias!' });
            }

            catego.nombre = nombre;
            catego.destacado = destacado;

            await catego.save(); // Guarda los cambios en la base de datos
            return res.json(catego);
        } else {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la categoria:', error);
        return res.status(500).json({ error: 'Error al actualizar la categoria' });
    }
}

async function obtenerCategoriaFiltrada(req, res) {
    const { categoria } = req.body;
    try {
        const catego = await Categoria.findAll({
            where: {
                destacado: categoria,
            }
        });
        return res.json(catego);
    } catch (error) {
        console.error('Error al obtener Categoria filtrada:', error);
        return res.status(500).json({ error: 'Error al obtener Categoria filtrada' });
    }
}


module.exports = {
    obtenerCategoria,
    obtenerUnaCategoria,
    crearCategoria,
    eliminarCategoriaPorId,
    actualizarCategoriaPorId,
    obtenerCategoriaFiltrada,
};