const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const CarritoDetalle = require('./carritoDetalleModel');
const Foto = require('./fotoModel');
const PedidoDetalle = require('./pedidoDetalleModel');


const Inventario = sequelize.define('inventario', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  talla: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descuento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  producto_codigo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eliminado:{
    type: DataTypes.CHAR
  }
}, {
  tableName: 'inventario',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['talla', 'color','producto_codigo']
    }
  ]
}
);

Inventario.hasMany(Foto, { foreignKey: 'inventario_codigo' });
Inventario.hasMany(CarritoDetalle, { foreignKey: 'inventario_codigo' });
Inventario.hasMany(PedidoDetalle, { foreignKey: 'inventario_codigo' });

//Inventario.sync();

module.exports = Inventario;
