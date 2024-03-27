const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Carrito = require('./carritoModel');
const Pedido = require('./pedidoModel');


const Cliente = sequelize.define('cliente', {
    cedula: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion_completa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    informacion_complementaria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eliminado:{
      type: DataTypes.CHAR
    }
  },{
    tableName:'cliente',
    timestamps: false,
  }
  );

  Cliente.hasMany(Carrito, { foreignKey: 'cliente_cedula' });
  Cliente.hasMany(Pedido, { foreignKey: 'cliente_cedula' });
  
  //Cliente.sync();

  module.exports = Cliente;
