const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      console.log('Conexión a la base de datos exitosa');
    } catch (error) {
      console.error('Error en la conexión a la base de datos:', error);
    }
  })();
console.log(process.env.puerto);
const port = process.env.PORT || 3000;
const inventarioRouter = require('./routes/inventario');
const productoRouter = require('./routes/productos');
const usuarioRouter = require('./routes/usuarios');
const clienteRouter = require('./routes/cliente');
const empleadoRouter = require('./routes/empleado');
const fotosRouter = require('./routes/fotos');
const categoriaRouter = require('./routes/categoria');

const medioRouter = require('./routes/medioPago');
const carritoRouter = require('./routes/carrito');
const pedidoRouter = require('./routes/pedidos');
const { async } = require('@firebase/util');
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())


app.use('/productos', productoRouter);
app.use('/usuario', usuarioRouter);
app.use('/cliente', clienteRouter);
app.use('/empleado', empleadoRouter);
app.use('/categoria', categoriaRouter);
app.use('/fotos', fotosRouter);
app.use('/inventario', inventarioRouter);
app.use('/medioPago', medioRouter);
app.use('/carrito', carritoRouter);
app.use('/pedido', pedidoRouter);

app.listen(port, () => {
    console.log(`server on port ${port}`);
})

