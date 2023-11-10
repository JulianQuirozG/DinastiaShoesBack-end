const express = require('express');
const morgan = require('morgan');
const app= express();
const port = process.env.PORT || 3000;
const productoRouter = require('./routes/productos');
const usuarioRouter = require('./routes/usuarios');
const clienteRouter = require('./routes/cliente');
const empleadoRouter = require('./routes/empleado');

app.use(morgan('dev'))
app.use(express.json())

app.use('/productos',productoRouter);
app.use('/usuario',usuarioRouter);
app.use('/cliente',clienteRouter);
app.use('/empleado',empleadoRouter);


app.listen(port, ()=>{
    console.log(`server on port ${3000}`);
})

