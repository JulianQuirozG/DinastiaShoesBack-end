const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const PedidoDetalle = sequelize.define('pedido_detalle', {
    pedido_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    inventario_codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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


  //PedidoDetalle.sync();

  module.exports = PedidoDetalle;
