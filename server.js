const express = require('express')
const morgan = require('morgan')
const app= express()
const port = process.env.PORT || 3000;
const comerceRouter = require('./routes/productos')

app.use(morgan('dev'))
app.use(express.json())

app.use('/api',comerceRouter)


app.listen(port, ()=>{
    console.log(`server on port ${3000}`);
})

