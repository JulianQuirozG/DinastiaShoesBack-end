const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Cliente = require('./clienteModel');
const Empleado = require('./empleadoModel');


const Usuario = sequelize.define('usuario', {
    cedula: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasenia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.CHAR,
      allowNull: false,
    }
  },{
    tableName:'usuario',
    timestamps: false,
  }
  );
  Usuario.hasMany(Cliente, { foreignKey: 'cedula' });
  Usuario.hasMany(Empleado, { foreignKey: 'cedula' });
  //Usuario.sync();
  module.exports = Usuario;
