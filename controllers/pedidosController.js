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
const MedioPago = require('../models/MedioDePago');
const Usuario = require('../models/usuarioModel');
const { async } = require('@firebase/util');
const moment = require('moment-timezone');

//LISTAR pedidos
async function obtenerPedido(req, res) {
  try {
    const carrito = await Pedido.findAll({
      include: [
        {
          model: PedidoDetalle,
        },
      ]
    });

    const anexarMedioPago = await carrito.map(async (carr) => {
      const medio = await MedioPago.findOne({
        where: {
          id: carr.mediopago_id,
        }
      });
     
      carr.dataValues.fecha = moment(carr.fecha).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

      return [{ carr }, { medio }]
    });

    const respuesta = await Promise.all(anexarMedioPago);

    return res.json(respuesta);

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}



async function obtenerUnPedido(req, res) {
  try {
    const { id } = req.params;
    const carrito = await Inventario.findAll({
      include: [
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

    const persona = await Usuario.findOne({
      include: [
        {
          model: Cliente,
          include: [
            {
              model: Pedido,
              where: {
                id: carrito[0].pedido_detalles[0].pedido_id,
              }
            }
          ]
        }
      ]
    });

    let costoTotal = 0;
    const costo = await carrito.map(async (carr) => {
      const costos = carr.pedido_detalles[0].cantidad * carr.precio;
      costoTotal = costos + costoTotal;
      return { costoTotal }
    });

    const costoT = await Promise.all(costo);

    return res.json([{ carrito }, { persona }, { 'Total': costoTotal }]);

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}


async function obtenerPedidosPorUsuario(req, res) {
  try {
    const { cedula } = req.params;

    const persona = await Cliente.findByPk(cedula, {
      include: [
        {
          model: Pedido,
        },
      ],
    });

    const pedidos = await persona.pedidos.map(async (pedido) => {
      const detalle = await PedidoDetalle.findAll({
        where: {
          pedido_id: pedido.id,
        }
      });
      let costoTotal = 0;
      const productoss = await Promise.all(
        detalle.map(async (product) => {
          const producto = await Producto.findOne({
            include: [
              {
                model: Inventario,
                where: {
                  codigo: product.inventario_codigo,
                },
                include: [
                  {
                    model: Foto,
                  }
                ]
              },
            ],
          });

          const costos = product.cantidad * producto.inventarios[0].precio;
          costoTotal = costos + costoTotal;


          return { product, producto };
        })
      );

      pedido.dataValues.fecha = moment(pedido.fecha).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

      return { pedido, productoss, costoTotal };
    });

    const resultado = await Promise.all(pedidos);

    //const inventario = await resultado.

    return res.json(resultado);

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}


//CREAR UN CARRITO
async function crearPedido(req, res) {
  try {
    const { id, cliente_cedula, mediodepago } = req.body;
    const { comprobar } = req.files;

    const carrito = await CarritoDetalle.findAll({
      where: {
        carrito_id: id,
      },
    });

    if (carrito.length == 0) {
      return res.status(500).json("debes agregar productos al carrito");
    }

    if (!cliente_cedula) {
      return res.status(500).json("debes iniciar sesion");
    }

    const clienteinfo = await Cliente.findOne({
      where: {
        cedula: cliente_cedula,
      },
    });

    if (!comprobar) {
      return res.status(500).json("debes agregar una imagen para el comprobante");
    }

    const { ref: refLogo, downloadURL: downloadURLLogo } = await uploadFile(comprobar[0]);
    const url = downloadURLLogo;
    const fechaActualBogota = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    
    const pedido = await Pedido.create({
      direccion: clienteinfo.direccion_completa,
      informacion_complementaria: clienteinfo.informacion_complementaria,
      fecha: fechaActualBogota,
      estado: 'P',
      cliente_cedula: cliente_cedula,
      comprobante: url,
      mediopago_id: mediodepago,

    });


    const carritoDetalle = carrito.map(async (carr) => {
      const productoinventario = await Inventario.findOne({
        where: {
          codigo: carr.inventario_codigo,
        },
      });

      if (carr.cantidad <= productoinventario.cantidad) {

        if (productoinventario) {
          productoinventario.cantidad = productoinventario.cantidad - carr.cantidad;
          productoinventario.save();
        }

        const productopedido = await PedidoDetalle.create({
          pedido_id: pedido.id,
          inventario_codigo: carr.inventario_codigo,
          cantidad: carr.cantidad
        })

        return { productopedido };
      }
    });

    const respuesta = await Promise.all(carritoDetalle);
   
    const valdiar = await PedidoDetalle.findAll({
      where:{
        pedido_id:pedido.id,
      }
    });
    
    const carritoEliminar = carrito.map(async (carr) => {
      carr.destroy();
    });

    const eliminar = await Promise.all(carritoEliminar);
    
    
    if (valdiar.length==0) {
      try{
        await pedido.destroy();
        console.error('Error al crear el pedido:');
        return res.json({'error': 'No hay productos en el carrito' });
      }catch(error){
        await pedido.destroy();
        console.error('Error al crear el pedido:', error);
        return res.json({ 'error': 'No hay productos en el carrito' });
      }
      
    }

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

async function actualizarPedidoId(req, res) {
  const { id, estado } = req.body;

  try {
    const carrito = await Pedido.findByPk(id);

    if (carrito) {
      // Actualiza los datos del producto
      carrito.estado = estado;

      await carrito.save(); // Guarda los cambios en la base de datos
      res.json(carrito);
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el pedido', message: error });
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





module.exports = {
  obtenerPedido,
  crearPedido,
  eliminarPedido,
  obtenerUnPedido,
  actualizarPedidoId,
  obtenerPedidosPorUsuario
};