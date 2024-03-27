const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Pedido = require('./pedidoModel');


const MedioPago = sequelize.define('mediopago', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eliminado:{
      type: DataTypes.CHAR
    }
  },{
    tableName:'mediopago',
    timestamps: false,
  }
  );
  
 MedioPago.hasMany(Pedido, { foreignKey: 'mediopago_id' });

  //MedioPago.sync();

  module.exports = MedioPago;
