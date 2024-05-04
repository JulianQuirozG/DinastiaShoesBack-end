const jwt = require('jsonwebtoken');
require('dotenv').config();

const protegerRuta = (usuariosPermitidos) => async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'No hay token, acceso no autorizado' });

        jwt.verify(authHeader, process.env.JWT_PASS, (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Token inválido' });

            const user = decoded.tipo;
            console.log(user);
            if (!usuariosPermitidos.includes(user)) return res.status(403).json({ error: 'No cuenta con los permisos suficientes para esta función.' });
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        console.error(error)
    }

}

module.exports = protegerRuta;