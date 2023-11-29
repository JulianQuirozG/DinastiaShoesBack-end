const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app= express();
const port = process.env.PORT || 3000;
const productoRouter = require('./routes/productos');
const usuarioRouter = require('./routes/usuarios');
const clienteRouter = require('./routes/cliente');
const empleadoRouter = require('./routes/empleado');
const fotosRouter = require('./routes/fotos');
const categoriaRouter = require('./routes/categoria');
const inventarioRouter = require('./routes/inventario');
const medioRouter = require('./routes/medioPago');
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())

app.use('/productos',productoRouter);
app.use('/usuario',usuarioRouter);
app.use('/cliente',clienteRouter);
app.use('/empleado',empleadoRouter);
app.use('/categoria',categoriaRouter);
app.use('/fotos',fotosRouter);
app.use('/inventario',inventarioRouter);
app.use('/medioPago',medioRouter);

app.listen(port, ()=>{
    console.log(`server on port ${port}`);
})

