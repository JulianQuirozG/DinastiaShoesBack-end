const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
var path = require('path');
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

const port = process.env.PORT || 3000;
const router = express.Router();

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

router.use(express.static(path.join(__dirname, 'public')));
router.use('/productos', productoRouter);
router.use('/usuario', usuarioRouter);
router.use('/cliente', clienteRouter);
router.use('/empleado', empleadoRouter);
router.use('/categoria', categoriaRouter);
router.use('/fotos', fotosRouter);
router.use('/inventario', inventarioRouter);
router.use('/medioPago', medioRouter);
router.use('/carrito', carritoRouter);
router.use('/pedido', pedidoRouter);

app.use(router);

app.listen(port, "0.0.0.0",() => {
    console.log(`server on port ${port} ${process.env.DB_HOST} ${process.env.DB_PORT} ${process.env.DB_USER} ${process.env.DB_PASSWORD}  ${process.env.DB_DATABASE}`);
})

