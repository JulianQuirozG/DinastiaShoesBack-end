require('dotenv').config();

const { Sequelize } = require('sequelize');
const sequelize  = new Sequelize(
    
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
    }
  );

// console.log("Procesando manos",sequelize);
// Verifica la conexión a la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
  }
})();

module.exports = sequelize;

