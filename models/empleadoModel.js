const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const Empleado = sequelize.define('empleado', {
    cedula: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    inventario: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    ventas: {
      type: DataTypes.CHAR,
      allowNull: false,
    }
  },{
    tableName:'empleado',
    timestamps: false,
  }
  );

  //Empleado.sync();

  module.exports = Empleado;
