const jwt = require('jsonwebtoken');
require('dotenv').config();

const protegerRuta = (usuariosPermitidos) => async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            const error = new Error('No hay token, acceso no autorizado');
            error.status = 401;
            throw error;
        }

        jwt.verify(authHeader, process.env.JWT_PASS, (err, decoded) => {
            if (err) {
                const error = new Error('Token inválido');
                error.status = 403;
                throw error;
            }

            const user = decoded.tipo;
            console.log(user);
            if (!usuariosPermitidos.includes(user)) {
                const error = new Error('Usuario no permitido');
                error.status = 403;
                throw error;
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        next(error.message);
    }

}

module.exports = protegerRuta;