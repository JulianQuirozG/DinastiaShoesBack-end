const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const CarritoDetalle = require('./carritoDetalleModel');

const Carrito = sequelize.define('carrito', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    cliente_cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{
    tableName:'carrito',
    timestamps: false,
  }
  );

  Carrito.hasMany(CarritoDetalle, { foreignKey: 'carrito_id' });
  Carrito.sync();

  module.exports = Carrito;
