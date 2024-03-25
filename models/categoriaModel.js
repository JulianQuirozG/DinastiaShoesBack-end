const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Producto = require('./productoModel');


const Categoria = sequelize.define('categoria', {
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
    destacado: {
      type: DataTypes.CHAR,
      allowNull: false,
    }
  },{
    tableName:'categoria',
    timestamps: false,
  }
  );
  
  Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });

  //Categoria.sync();

  module.exports = Categoria;
