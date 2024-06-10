require('dotenv').config();

const { Sequelize } = require('sequelize');
const sequelize  = new Sequelize(
    
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      timezone: "-03:00"
    }
);

// console.log("Procesando manos",sequelize);
// Verifica la conexión a la base de datos
module.exports = sequelize;

