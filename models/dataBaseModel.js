const MedioPago = require('./MedioDePago');
const CarritoDetalle = require('./carritoDetalleModel');
const Carrito = require('./carritoModel');
const Categoria = require('./categoriaModel');
const Cliente = require('./clienteModel');
const Empleado = require('./empleadoModel');
const Foto = require('./fotoModel');
const Inventario = require('./inventarioModel');
const PedidoDetalle = require('./pedidoDetalleModel');
const Pedido = require('./pedidoModel');
const Producto = require('./productoModel');
const Usuario = require('./usuarioModel');
const sequelize = require('../config/database');

Carrito.hasMany(CarritoDetalle, { foreignKey: 'carrito_id' });

Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });

Cliente.hasMany(Carrito, { foreignKey: 'cliente_cedula' });
Cliente.hasMany(Pedido, { foreignKey: 'cliente_cedula' });

Inventario.hasMany(Foto, { foreignKey: 'inventario_codigo' });
Inventario.hasMany(CarritoDetalle, { foreignKey: 'inventario_codigo' });
Inventario.hasMany(PedidoDetalle, { foreignKey: 'inventario_codigo' });

MedioPago.hasMany(Pedido, { foreignKey: 'mediopago_id' });

Pedido.hasMany(PedidoDetalle, { foreignKey: 'pedido_id' });

Producto.hasMany(Inventario, { foreignKey: 'producto_codigo' });

Usuario.hasMany(Cliente, { foreignKey: 'cedula' });
Usuario.hasMany(Empleado, { foreignKey: 'cedula' });

sequelize.sync()

module.exports = {
    MedioPago,
    CarritoDetalle,
    Carrito,
    Categoria,
    Cliente,
    Empleado,
    Foto,
    Inventario,
    PedidoDetalle,
    Pedido,
    Producto,
    Usuario,
}