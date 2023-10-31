const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const Producto = sequelize.define('producto', {
  codigo: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
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
Producto.sync();

module.exports = Producto;
