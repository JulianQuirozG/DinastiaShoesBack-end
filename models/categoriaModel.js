const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const Categoria = sequelize.define('categoria', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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

  Categoria.sync();

  module.exports = Categoria;
