const Producto = require('../models/productoModel'); // Importa el modelo de usuario
const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');

//LISTAR PRODUCTOS
async function obtenerInventarioProductos(req, res) {
    try {
        const inventario = await Inventario.findAll({
            include: [
                {
                    model: Foto,
                    attributes: ['codigo', 'url_foto', 'inventario_codigo'],
                }
            ]
        });

        res.json(inventario);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

//OBTENER UN PRODUCTO POR EL ID
async function obtenerUnProductodelInventario(req, res) {
    const { codigo } = req.params;

    try {
        const producto = await Inventario.findByPk(codigo,{
            include: [
                {
                    model: Foto,
                }
            ]
        });

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}


//CREAR UN PRODUCTO
async function crearInventarioProducto(req, res) {
    const { cantidad, talla, color, precio, descuento, producto_codigo } = req.body;

    try {
        // Crea un nuevo producto en la base de datos
        const nuevoInventarioProducto = await Inventario.create({ 
            cantidad, 
            talla, 
            color, 
            precio, 
            descuento, 
            producto_codigo
        });

        res.json(nuevoInventarioProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

//ELIMINAR UN PRODUCTO
async function eliminarInventarioProductoPorId(req, res) {
    const { codigo } = req.params;
    await console.log("codigo: ", codigo);
    try {
        const productoInv = await Inventario.findByPk(codigo);
        if (productoInv) {
            await productoInv.destroy(); // Elimina el producto de la base de datos
            res.json({ mensaje: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}


//actualizar por id
async function actualizarProductoPorId(req, res) {
    const { codigo } = req.params;
    const { cantidad, talla, color, precio, descuento } = req.body;

    try {
        const producto = await Inventario.findByPk(codigo);

        if (producto) {
            // Actualiza los datos del producto
            producto.cantidad = cantidad;
            producto.talla = talla;
            producto.color = color;
            producto.precio = precio;
            producto.descuento = descuento;

            await producto.save(); // Guarda los cambios en la base de datos
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

module.exports = {
    actualizarProductoPorId,
    eliminarInventarioProductoPorId,
    crearInventarioProducto,
    obtenerUnProductodelInventario,
    obtenerInventarioProductos,
};