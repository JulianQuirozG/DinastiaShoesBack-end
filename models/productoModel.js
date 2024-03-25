const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Inventario = require('./inventarioModel');


const Producto = sequelize.define('producto', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destacado: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},{
  tableName:'producto',
  timestamps: false,
}
);

// Sincroniza el modelo con la base de datos

//Producto.hasMany(Inventario, { foreignKey: 'producto_codigo' });
Producto.hasMany(Inventario, { foreignKey: 'producto_codigo' });
//Inventario.hasMany(Foto, { foreignKey: 'inventario_codigo' });

//Producto.sync();

module.exports = Producto;
