const jwt = require('jsonwebtoken');
require('dotenv').config();

const protegerRuta = (usuariosPermitidos) => async (req, res, next)=>{

    const authHeader = req.headers['authorization'];
    if(!authHeader){
        const error = new Error('No hay token, acceso no autorizado');
        error.statusCode = 401;
        return next(error);
    } 

    jwt.verify(authHeader, process.env.JWT_PASS,(err, decoded) =>{
        if(err){
            const error = new Error('Token inválido');
            error.statusCode = 403;
            return next(error);
        }
        
        const user = decoded.tipo;
        console.log(user);
        if (!usuariosPermitidos.includes(user)) {
            const error = new Error('No cuenta con los permisos suficientes para esta función.');
            error.statusCode = 403;
            return next(error);
        }
        req.user=decoded;
        next();
    });
}

module.exports = protegerRuta;