const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');
const { async } = require('@firebase/util');

//LISTAR PRODUCTOS
async function obtenerInventarioProductos(req, res) {
    try {
        const inventario = await Inventario.findAll({
            include: [
                {
                    model: Foto,
                    attributes: ['codigo', 'url_foto', 'inventario_codigo'],
                }
            ],
            where: {
                eliminado: "0"
            }
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
        const producto = await Inventario.findByPk(codigo, {
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
        const inventario = await Inventario.findOne({
            where:{
                talla:talla,
                color:color,
                producto_codigo:producto_codigo,
            }
        });
        if (inventario) {
            inventario.cantidad=cantidad;
            inventario.precio=precio;
            inventario.descuento=descuento;
            inventario.eliminado= "0";

            inventario.save();

            return res.json({nuevoInventarioProducto: inventario});
        }



        // Crea un nuevo producto en la base de datos
        const nuevoInventarioProducto = await Inventario.create({
            cantidad,
            talla,
            color,
            precio,
            descuento,
            producto_codigo,
            eliminado: "0"
        });

        return res.json({nuevoInventarioProducto: nuevoInventarioProducto});
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
        const fotos = await Foto.findAll({
            where: {
                inventario_codigo: codigo,
            },
        });

        if (fotos.length > 0) {
            fotos.map(async (fo) => {
                fo.destroy();
            });
        }
        if (productoInv) {
            productoInv.eliminado = "1"
            await productoInv.save(); // Elimina el producto de la base de datos
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
            producto.eliminado = "0";
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

//OBTENER UN PRODUCTO POR EL ID
async function obtenerVariantesdeProductodelInventario(req, res) {
    const { codigo, color } = req.body;

    try {
        const producto = await Inventario.findAll({
            where: {
                eliminado: "0",
                color: color,
                producto_codigo: codigo,


            },
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



module.exports = {
    actualizarProductoPorId,
    eliminarInventarioProductoPorId,
    crearInventarioProducto,
    obtenerUnProductodelInventario,
    obtenerInventarioProductos,
    obtenerVariantesdeProductodelInventario,
};