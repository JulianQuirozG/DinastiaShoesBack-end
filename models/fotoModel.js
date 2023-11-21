const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Producto = require('./productoModel');

const Foto = sequelize.define('foto', {
    codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    url_foto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{
    tableName:'foto',
    timestamps: false,
  }
  );
  
  Foto.sync();

  module.exports = Foto;
