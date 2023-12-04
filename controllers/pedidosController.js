const Producto = require('../models/productoModel'); // Importa el modelo de usuario
const Inventario = require('../models/inventarioModel');
const Foto = require('../models/fotoModel');
const Carrito = require('../models/carritoModel');
const CarritoDetalle = require('../models/carritoDetalleModel');
const Pedido = require('../models/pedidoModel');
const PedidoDetalle = require('../models/pedidoDetalleModel');
const Cliente = require('../models/clienteModel');
const { uploadFile } = require('../util/adminFirebase');
const { where } = require('sequelize');

//LISTAR PRODUCTOS
async function obtenerPedido(req, res) {
  try {
    const { id } = req.params;
    const carrito = await Pedido.findAll({
      include: [
        {
          model: PedidoDetalle,
        },
      ]
    });

    res.json(carrito);

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}

async function obtenerUnPedido(req, res) {
  try {
    const { id } = req.params;
    const carrito = await Inventario.findAll({
      include:[
        {
          model: PedidoDetalle,
          where: {
            pedido_id: id,
          },
        }, 
        {
          model: Foto,
        },
   
      ],
      
    
    });

    res.json(carrito);

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}


//CREAR UN CARRITO
async function crearPedido(req, res) {
  try {
    const { id, fecha, cliente_cedula, mediodepago } = req.body;
    const { comprobar } = req.files;

    const carrito = await CarritoDetalle.findAll({
      where: {
        carrito_id: id,
      },
    });

    if (carrito.length == 0) {
      return res.error(500).json("debes agregar productos al carrito");
    }

    if (!cliente_cedula) {
      return res.error(500).json("debes iniciar sesion");
    }

    const clienteinfo = await Cliente.findOne({
      where: {
        cedula: cliente_cedula,
      },
    })

    if (!comprobar) {
      return res.error(500).json("debes agregar una imagen para el comprobante");
    }
    const { ref: refLogo, downloadURL: downloadURLLogo } = await uploadFile(comprobar[0]);
    const url = downloadURLLogo;
    //console.log(downloadURLLogo);

    const pedido = await Pedido.create({
      direccion: clienteinfo.direccion_completa,
      informacion_complementaria: clienteinfo.informacion_complementaria,
      fecha: fecha,
      estado: 'P',
      cliente_cedula: cliente_cedula,
      comprobante: url,
      mediopago_id: mediodepago,

    });


    const carritoDetalle = carrito.map(async (carr) => {

      const productopedido = await PedidoDetalle.create({
        pedido_id: pedido.id,
        inventario_codigo: carr.inventario_codigo,
        cantidad: carr.cantidad
      })

      return { productopedido };

    });
    const respuesta = await Promise.all(carritoDetalle);

    return res.json(respuesta);
  }
  catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
}

//ELIMINAR UN PRODUCTO
async function eliminarPedido(req, res) {

  try {
    const { id } = req.params;
    const eliminarPedido = await Pedido.findOne({
      where: {
        id: id,
      },
    });

    if (eliminarPedido) {
      await eliminarPedido.destroy(); // Elimina el producto de la base de datos
      return res.json({ mensaje: 'Pedido eliminado exitosamente' });
    } else {
      return res.status(404).json({ error: 'Pedido no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error al eliminar el Pedido:', error);
    res.status(500).json({ error: 'Error al eliminar el Pedido' });
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
  obtenerPedido,
  crearPedido,
  eliminarPedido,
  obtenerUnPedido
};