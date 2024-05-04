const Producto = require('../models/productoModel'); // Importa el modelo de usuario
const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');
const Categoria = require('../models/categoriaModel');

//LISTAR PRODUCTOS
async function obtenerProductos(req, res) {
  try {
    const producto = await Producto.findAll({
      include: [
        {
          model: Inventario,
          where: {
            eliminado: "0",
          },
          include: [
            {
              model: Foto
            }
          ]
        },

      ]
    });

    return res.json(producto);

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
  }
}

//
async function obtenerTallasColoresCategorias(req, res) {
  try {
    const colores = await Inventario.findAll({
      attributes: ['color'],
      distinct: true
    });

    const tallas = await Inventario.findAll({
      attributes: ['talla'],
      distinct: true
    });

    const categorias = await Categoria.findAll({
      attributes: ['id', 'nombre'],
      distinct: true
    });

    return res.json({ colores, tallas, categorias });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
  }
}

async function obtenerFiltradoTallaColor(req, res) {
  try {
    const { color, talla } = req.body;
    let col, tal;
    if (!color || color.length == 0) {
      col = `*`;
    } else {
      col = color;
    }
    if (!talla || talla.length == 0) {
      tal = `*`;
    } else {
      tal = talla;
    }

    if (color && talla && color.length > 0 && talla.length > 0) {
      const productos = await Producto.findAll({
        include: [
          {
            model: Inventario,
            where: {
              color: col,
              talla: tal,
              eliminado: "0",
            },
            include: [
              {
                model: Foto,
              }
            ]
          }
        ]
      });
      return res.json(productos);
    } else if (color && color.length > 0) {
      const productos = await Producto.findAll({
        include: [
          {
            model: Inventario,
            where: {
              color: col,
              eliminado: "0",
            },
            include: [
              {
                model: Foto,
              }
            ]

          }
        ]
      });
      return res.json(productos);
    } else if (talla && talla.length > 0) {
      const productos = await Producto.findAll({
        include: [
          {
            model: Inventario,
            where: {
              talla: tal,
              eliminado: "0",
            },
            include: [
              {
                model: Foto,
              }
            ]
          }
        ]
      });
      return res.json(productos);
    } else {
      const productos = await Producto.findAll({
        include: [
          {
            model: Inventario,
            where: {
              eliminado: "0",
            },
            include: [
              {
                model: Foto,
              }
            ]
          }
        ]
      });
      return res.json(productos);
    }

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
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
          where: {
            eliminado: "0",
          },
          include: [
            {
              model: Foto
            }
          ]
        },
      ]
    });

    return res.json(producto);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener productos' });
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

    return res.json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ error: 'Error al crear el producto' });
  }
}

//ELIMINAR UN PRODUCTO
async function eliminarProductoPorId(req, res) {
  const { codigo } = req.params;
  //await console.log("codigo: ", codigo);
  try {
    const producto = await Producto.findByPk(codigo);
    //console.log(producto);
    if (producto) {

      await producto.destroy(); // Elimina el producto de la base de datos
      return res.json({ mensaje: 'Producto eliminado exitosamente' });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
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
  const { categoria } = req.params;
  try {
    const catego = await Producto.findAll({
      where: {
        destacado: categoria,
      },
      include: [
        {
          model: Inventario,
          where: {
            eliminado: "0",
          },
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
  obtenerProductos,
  obtenerUnProducto,
  crearProducto,
  eliminarProductoPorId,
  actualizarProductoPorId,
  obtenerProductoFiltrado,
  obtenerTallasColoresCategorias,
  obtenerFiltradoTallaColor
};