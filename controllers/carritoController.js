const Producto = require('../models/productoModel'); // Importa el modelo de usuario
const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');
const Carrito = require('../models/carritoModel');
const CarritoDetalle = require('../models/carritoDetalleModel');

//LISTAR PRODUCTOS
async function obtenerCarrito(req, res) {
  try {
    const { cedula } = req.params;
    const carrito = await Carrito.findOne({
      where: {
        cliente_cedula: cedula,
      },
    });

    const carritoDetalle = await Producto.findAll({
      include: [
        {
          model: Inventario,
          required: true,
          include: [
            {
              model: CarritoDetalle,
              where: {
                carrito_id: carrito.id,
              }
            },
            {
              model: Foto,
            },
          ]
        },
      ]
    });

    return res.json(carritoDetalle);

  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return res.status(500).json({ error: 'Error al obtener el carrito' });
  }
}


//CREAR UN CARRITO
async function crearCarritoYagregarProducto(req, res) {
  const { cedula, producto, cantidad } = req.body;

  try {
    const carrito = await Carrito.findOne({
      where: {
        cliente_cedula: cedula,
      },
    });

    const cantidadInventario = await Inventario.findByPk(producto);

    const cantidadvs = cantidadInventario.cantidad;
    if (cantidad > cantidadvs) {
      return res.json({ error: "La cantidad asignada excede las existencias disponibles" });
    }

    if (!carrito) {

      const nuevoCarrito = await Carrito.create({
        cliente_cedula: cedula,
      });

      const id = nuevoCarrito.id;

      const agregarCarrito = await CarritoDetalle.create({
        inventario_codigo: producto,
        carrito_id: id,
        cantidad: cantidad
      })
      return res.json(agregarCarrito);

    } else {
      const id = carrito.id;

      const productoExist = await CarritoDetalle.findOne({
        where: {
          carrito_id: id,
          inventario_codigo: producto,
        }
      });

      if (productoExist) {
        productoExist.cantidad = cantidad;
        await productoExist.save();
        return res.json(productoExist);
      } else {
        const agregarCarrito = await CarritoDetalle.create({
          inventario_codigo: producto,
          carrito_id: id,
          cantidad: cantidad
        })
        return res.json(agregarCarrito);
      }
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
}

//ELIMINAR UN PRODUCTO
async function eliminarInventariodelCarritoPorId(req, res) {

  try {
    const { id, inventa } = req.body;
    const eliminarProducto = await CarritoDetalle.findOne({
      where: {
        carrito_id: id,
        inventario_codigo: inventa,
      },
    });

    if (eliminarProducto) {
      await eliminarProducto.destroy(); // Elimina el producto de la base de datos
      return res.json({ mensaje: 'Producto eliminado exitosamente' });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

async function eliminarTodosInventariodelCarrito(req, res) {

  try {
    const id = parseInt(req.params.id, 10);
    const eliminarProductos = await CarritoDetalle.findAll({
      where: {
        carrito_id: id,
      },
    });

    if (eliminarProductos && eliminarProductos.length > 0) {
      await Promise.all(eliminarProductos.map(async (producto) => {
        await producto.destroy();
      })); // Elimina el producto de la base de datos

      return res.json({ mensaje: 'Productos eliminados exitosamente' });
    } else {
      return res.status(404).json({ error: 'El carrito está vacio' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

//actualizar por id
async function actualizarProductoPorId(req, res) {
  const { codigo } = req.params;
  const { nombre, descripcion, destacado, categoria_id } = req.body;

  try {
    const producto = await Producto.findByPk(codigo);

    if (producto) {
      // Actualiza los datos del producto
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.destacado = destacado;
      producto.categoria_id = categoria_id;

      await producto.save(); // Guarda los cambios en la base de datos
      return res.json(producto);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

async function obtenerProductoFiltrado(req, res) {
  const { categoria } = req.body;
  try {
    const catego = await Producto.findAll({
      where: {
        destacado: categoria,
      },
      include: [
        {
          model: Inventario,
          include: [
            {
              model: Foto
            }
          ]
        },

      ]

    });
    return res.json(catego);
  } catch (error) {
    console.error('Error al obtener Producto filtrada:', error);
    return res.status(500).json({ error: 'Error al obtener Producto filtrada' });
  }
}



module.exports = {
  obtenerCarrito,
  crearCarritoYagregarProducto,
  eliminarInventariodelCarritoPorId,
  eliminarTodosInventariodelCarrito
};