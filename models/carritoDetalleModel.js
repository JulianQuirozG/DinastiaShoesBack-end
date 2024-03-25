const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a la base de datos


const CarritoDetalle = sequelize.define('carrito_detalle', {
    inventario_codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    carrito_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },{
    tableName:'carrito_detalle',
    timestamps: false,
  }
  );
    
  //CarritoDetalle.belongsTo(Inventario);
  //CarritoDetalle.sync();

  module.exports = CarritoDetalle;
