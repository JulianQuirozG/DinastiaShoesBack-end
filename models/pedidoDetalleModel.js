const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const PedidoDetalle = sequelize.define('pedido_detalle', {
    pedido_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    inventario_codigo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },{
    tableName:'pedido_detalle',
    timestamps: false,
  }
  );


  PedidoDetalle.sync();

  module.exports = PedidoDetalle;
