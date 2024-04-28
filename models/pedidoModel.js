const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const PedidoDetalle = require('./pedidoDetalleModel');


const Pedido = sequelize.define('pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    informacion_complementaria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    cliente_cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comprobante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediopago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },{
    tableName:'pedido',
    timestamps: false,
  }
  );

  Pedido.hasMany(PedidoDetalle, { foreignKey: 'pedido_id' });
  //Pedido.sync();

  module.exports = Pedido;
