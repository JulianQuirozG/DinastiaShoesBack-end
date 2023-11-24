const Producto = require('../models/productoModel'); // Importa el modelo de usuario
const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');

//LISTAR PRODUCTOS
async function obtenerProductos(req, res) {
  try {
    const producto = await Producto.findAll({
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

    res.json(producto);

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

//OBTENER UN PRODUCTO POR EL ID
async function obtenerUnProducto(req, res) {
  const { codigo } = req.params;
  try {
    const producto = await Producto.findByPk(codigo, {
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

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}


//CREAR UN PRODUCTO
async function crearProducto(req, res) {
  const { codigo, nombre, descripcion, destacado, categoria_id } = req.body;

  try {
    // Crea un nuevo producto en la base de datos
    const nuevoProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      destacado,
      categoria_id
    });

    res.json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
}

//ELIMINAR UN PRODUCTO
async function eliminarProductoPorId(req, res) {
  const { codigo } = req.params;
  await console.log("codigo: ", codigo);
  try {
    const producto = await Producto.findByPk(codigo);
    console.log(producto);
    if (producto) {
      await producto.destroy(); // Elimina el producto de la base de datos
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
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
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
    res.json(catego);
  } catch (error) {
    console.error('Error al obtener Producto filtrada:', error);
    res.status(500).json({ error: 'Error al obtener Producto filtrada' });
  }
}

module.exports = {
  obtenerProductos,
  obtenerUnProducto,
  crearProducto,
  eliminarProductoPorId,
  actualizarProductoPorId,
  obtenerProductoFiltrado
};