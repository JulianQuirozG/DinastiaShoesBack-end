const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

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
      }
  },{
    tableName:'cliente',
    timestamps: false,
  }
  );

  Cliente.sync();

  module.exports = Cliente;
