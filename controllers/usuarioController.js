const Usuario = require('../models/usuarioModel'); // Importa el modelo de usuario
const Cliente = require('../models/clienteModel'); // Importa el modelo de usuario
const Empleado = require('../models/empleadoModel'); // Importa el modelo de usuario
const { fechaParse } = require("../util/parseFecha")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { transporter } = require('../config/nodemailer');
require('dotenv').config();

//Listar Usuarios
async function obtenerUsuario(req, res) {
    try {
        const user = await Usuario.findAll();
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

async function obtenerClientes(req, res) {
    try {
        const user = await Usuario.findAll({
            include: [
                {
                    model: Cliente,
                    where: {
                        eliminado: "0",
                    }
                },
            ]
        });
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

async function obtenerEmpleados(req, res) {
    try {
        const user = await Usuario.findAll({
            include: [
                {
                    model: Empleado,
                },
            ]
        });
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

//Listar Usuarios Filtrados
async function obtenerUsuarioFiltrado(req, res) {
    const { filtro } = req.params;

    if (filtro == "C") {
        try {
            const user = await Usuario.findAll({
                include: [
                    {
                        model: Cliente,
                        where: {
                            eliminado: "0",
                        }
                    },
                ]
            });
            return res.json(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return res.status(500).json({ error: 'Error al obtener usuario' });
        }
    }

    try {
        const user = await Usuario.findAll({
            where: {
                tipo: filtro
            }
        });
        return res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

//Obtener un Usuario
async function obtenerUnUsuario(req, res) {
    const { cedula } = req.params;
    try {
        const user = await Usuario.findByPk(cedula, {
            //attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

//CREAR UN Cliente
async function crearUsuarioCliente(req, res) {
    const { cedula, nombres, apellidos, correo, contrasen, sexo, fecha_nacimiento } = req.body;
    const tipo = "C";
    try {
        const cliente = await Cliente.findByPk(cedula);
        const usuar = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if ((cliente && cliente.eliminado == "0") || (usuar && (usuar.cedula != cliente.cedula)) || (usuar && usuar.tipo != 'C')) {
            return res.status(404).json({ error: 'El usuario que intenta crear ya se encuentra registrado' });
        }

        const fechaFinal = (await fechaParse(fecha_nacimiento));
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasen, saltRounds);

        if (cliente && cliente.eliminado == "1") {
            usuar.nombres = nombres,
                usuar.apellidos = apellidos,
                usuar.correo = correo,
                usuar.contrasenia = hashedPassword,
                usuar.sexo = sexo,
                usuar.fecha_nacimiento = fechaFinal,
                usuar.tipo = tipo,
                usuar.eliminado = "0",
                await usuar.save();
            return res.json(usuar);
        }

        // Crea un nuevo usuario en la base de datos

        if (regex.test(contrasen)) {

            const user = await Usuario.create({
                cedula,
                nombres,
                apellidos,
                correo,
                contrasenia: hashedPassword,
                sexo,
                fecha_nacimiento: fechaFinal,
                tipo
            });

            return res.json(user);

        } else {
            return res.status(404).json({ error: 'Contraseña no valida' });
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

//CREAR UN Empleado
async function crearUsuarioEmpleado(req, res) {
    const { cedula, nombres, apellidos, correo, contrasen, sexo, fecha_nacimiento } = req.body;
    const tipo = "E";
    try {

        const usuar = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if (usuar) {
            return res.status(404).json({ error: 'El usuario que intenta crear ya se encuentra registrado' });
        }
        const fechaFinal = (await fechaParse(fecha_nacimiento));


        // Crea un nuevo usuario en la base de datos
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
        if (regex.test(contrasen)) {

            const saltRounds = 10;
            // Genera el hash de la contraseña
            const hashedPassword = await bcrypt.hash(contrasen, saltRounds);

            const user = await Usuario.create({
                cedula,
                nombres,
                apellidos,
                correo,
                contrasenia: hashedPassword,
                sexo,
                fecha_nacimiento: fechaFinal,
                tipo,
            });

            return res.json(user);

        } else {
            return res.status(404).json({ error: 'Contraseña no valida' });
        }

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

//CREAR UN Admin
async function crearUsuarioAdmin(req, res) {
    const { cedula, nombres, apellidos, correo, contrasen, sexo, fecha_nacimiento } = req.body;
    const tipo = "A";
    try {

        const usuar = await Usuario.findOne({
            where: {
                correo: correo
            }
        });

        if (usuar) {
            return res.status(404).json({ error: 'El usuario que intenta crear ya se encuentra registrado' });
        }

        // Crea un nuevo usuario en la base de datos
        const fechaFinal=(await fechaParse(fecha_nacimiento));
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
        if (regex.test(contrasen)) {

            const saltRounds = 10;
            // Genera el hash de la contraseña
            const hashedPassword = await bcrypt.hash(contrasen, saltRounds);

            const user = await Usuario.create({
                cedula,
                nombres,
                apellidos,
                correo,
                contrasenia: hashedPassword,
                sexo,
                fecha_nacimiento:fechaFinal,
                tipo,
            });

            res.json(user);

        } else {
            res.status(404).json({ error: 'Contraseña no valida' });
        }

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}


//ELIMINAR UN usuario
async function eliminarUsuarioPorId(req, res) {
    const { cedula } = req.params;
    //await console.log("codigo: ", cedula);
    try {
        const user = await Usuario.findByPk(cedula);
        const cli = await Cliente.findByPk(cedula);
        const emp = await Empleado.findByPk(cedula);
        //console.log(cliente);
        if (user) {
            if (emp) {
                await emp.destroy();
            }
            if (user.tipo == "E") {
                await user.destroy();
                return res.json({ mensaje: 'Empleado eliminado exitosamente' });
            }
            if (cli) {
                cli.eliminado = "1";
                await cli.save();
            }
            // // Elimina el usuario de la base de datos
            return res.json({ mensaje: 'usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}


//actualizar por id XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
async function actualizarUsuarioPorId(req, res) {
    const { cedula } = req.params;
    const { nombres, apellidos, correo, contrasenia, sexo, fecha_nacimiento } = req.body;
    
    try {
        const user = await Usuario.findByPk(cedula);
        const fechaFinal=(await fechaParse(fecha_nacimiento));
        if (user) {
            // Actualiza los datos del cliente
            user.nombres = nombres;
            user.apellidos = apellidos;
            user.correo = correo;
            user.sexo = sexo;
            user.fecha_nacimiento = fechaFinal;

            await user.save(); // Guarda los cambios en la base de datos
            res.json(user);

        } else {
            res.status(404).json({ error: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

//LOGIN
async function login(req, res) {
    const { usuario, password } = req.body;
    try {
        const user = await Usuario.findOne({
            where: {
                correo: usuario,
            },
        });

        if (user && user.tipo == "C") {
            const cliente = await Cliente.findByPk(user.cedula)
            if (cliente && cliente.eliminado == "1") {
                return res.status(404).json({ error: 'usuario no encontrado' });
            }
        }
        if (user && user) {
            const passwordsMatch = await bcrypt.compare(password, user.contrasenia);
            if (passwordsMatch) {

                const payload = {
                    cedula: user.cedula,
                    nombres: user.nombres,
                    tipo: user.tipo,
                    correo: user.correo,
                };
                const token = jwt.sign(payload, process.env.JWT_PASS, { expiresIn: '10h' });

                //res.json(passwordsMatch);
                return res.status(200).send({ token: token, usuario: user });

            } else {
                return res.status(401).json({ error: 'La clave es incorrecta' });
            }

        } else {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        return res.status(500).json({ error: 'Error al autenticar el usuario1' });
    }
}


async function enviarCorreoContrasenia(req, res) {
    try {
        const { destinatario } = req.params;

        const usuar = await Usuario.findOne({
            where: {
                correo: destinatario
            }
        })


        if (usuar == null) {
            return res.status(500).json({ error: 'El usuaio no se ha registrado' });
        } else {
            if (usuar && usuar.tipo == "C") {

                const client = await Cliente.findOne({
                    where: {
                        cedula: usuar.cedula
                    }
                }
                );
                console.log(client)
                if (client && client.eliminado == "1") {
                    return res.status(500).json({ error: 'El usuaio no se ha registrado' });
                }
            }
        }



        const payload = {
            correo: destinatario,
        };

        const token = jwt.sign(payload, process.env.JWT_PASS, { expiresIn: '15m' });

        const asunto = 'Recuperar contraseña DinastiaShoes';
        const cuerpo = `Haz click en el siguiente link para poder reestablecer tu contraseña: http://35.185.46.237:3000/recovery/reset/?token=${token}`;

        const mailOptions = {
            from: 'dinastiashoesoficial@hotmail.com',
            to: destinatario,
            subject: asunto,
            text: cuerpo,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Correo enviado:', info.response);
        return res.status(200).json({ mensaje: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo' });
    }
}


async function enviarCorreoContactanos(req, res) {
    try {
        const { destinatario, nombre, apellido, pregunta } = req.body;

        const asunto = `Contacto a DinastiaShoes de ${destinatario}`;

        const cuerpo = 'De: ' + nombre + ' ' + apellido + '\n' + 'Inquietud: ' + pregunta;

        const mailOptions = {
            from: 'dinastiashoesoficial@hotmail.com',
            to: 'dinastiashoesoficial@hotmail.com',
            subject: asunto,
            text: cuerpo,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Correo enviado:', info.response);
        return res.status(200).json({ mensaje: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo' });
    }
}


async function olvidarContraUsuario(req, res) {
    const { contrasen, } = req.body;
    const { token } = req.params;
    try {
        let rest=Boolean(true);
        let decoded1;
        jwt.verify(token, process.env.JWT_PASS,(err,decoded)=>{
            if (err) rest=Boolean(false);
            decoded1=decoded;
        });
        console.log(decoded1);
        if (!rest) {
            console.error('El token no es valido', err);
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
        if (regex.test(contrasen)) {

            const saltRounds = 10;
            // Genera el hash de la contraseña
            const hashedPassword = await bcrypt.hash(contrasen, saltRounds);
            
            const user = await Usuario.findOne({
                where: {
                    correo: decoded1.correo,
                },
            });

            if (user) {
                if(user.tipo="C"){
                    const cliente = await Cliente.findByPk(user.cedula);
                    if(cliente && cliente.eliminado=="1") return res.status(404).json({ error: 'usuario no encontrado' });
                }

                // Actualiza los datos del cliente
                user.contrasenia = hashedPassword;

                await user.save(); // Guarda los cambios en la base de datos
                return res.json(user);

            } else {
                return res.status(404).json({ error: 'usuario no encontrado' });
            }

        } else {
            return res.status(404).json({ error: 'Contraseña no valida' });
        }

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
}

async function cambiarContraUsuario(req, res) {
    const { usuario, password, contrasen } = req.body;
    try {
        const user = await Usuario.findOne({
            where: {
                correo: usuario,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const passwordsMatch = await bcrypt.compare(password, user.contrasenia);

        if (!passwordsMatch) {
            return res.status(401).json({ error: 'La clave actual es incorrecta' });
        }

        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
        if (!regex.test(contrasen)) {
            return res.status(400).json({ error: 'Nueva contraseña no válida' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasen, saltRounds);

        user.contrasenia = hashedPassword;

        await user.save(); // Guarda los cambios en la base de datos
        return res.json(user);
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        return res.status(500).json({ error: 'Error al autenticar el usuario' });
    }
}

async function obtenerUnUsuarioPorToken(req, res) {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_PASS);
        if (!decoded) {
            console.error('Error en la sesion', error);
            return res.status(500).json({ error: 'Error en la sesion' });
        }
        const user = await Usuario.findOne({
            where: {
                correo: decoded.correo,
            },
            //attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        return res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }
}


module.exports = {
    obtenerUsuario,
    obtenerUnUsuario,
    obtenerEmpleados,
    obtenerClientes,
    crearUsuarioAdmin,
    crearUsuarioCliente,
    crearUsuarioEmpleado,
    eliminarUsuarioPorId,
    actualizarUsuarioPorId,
    obtenerUsuarioFiltrado,
    login,
    olvidarContraUsuario,
    cambiarContraUsuario,
    enviarCorreoContrasenia,
    obtenerUnUsuarioPorToken,
    enviarCorreoContactanos
};
