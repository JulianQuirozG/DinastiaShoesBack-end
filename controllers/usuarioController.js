const Usuario = require('../models/usuarioModel'); // Importa el modelo de usuario
const Cliente = require('../models/clienteModel'); // Importa el modelo de usuario
const Empleado = require('../models/empleadoModel'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

//Listar Usuarios Filtrados
async function obtenerUsuarioFiltrado(req, res) {
    const { filtro } = req.params;
    try {
        const user = await Usuario.findAll({
            where: {
                tipo: filtro
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
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
                fecha_nacimiento,
                tipo
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

//CREAR UN Empleado
async function crearUsuarioEmpleado(req, res) {
    const { cedula, nombres, apellidos, correo, contrasen, sexo, fecha_nacimiento } = req.body;
    const tipo = "E";
    try {
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
                fecha_nacimiento,
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

//CREAR UN Admin
async function crearUsuarioAdmin(req, res) {
    const { cedula, nombres, apellidos, correo, contrasen, sexo, fecha_nacimiento } = req.body;
    const tipo = "A";
    try {
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
                fecha_nacimiento,
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
        const emp = await Cliente.findByPk(cedula);
        const cli = await Empleado.findByPk(cedula);
        //console.log(cliente);
        if (user) {
            if (emp) {
                await emp.destroy();
            }
            if (cli) {
                await cli.destroy();
            }
            await user.destroy(); // Elimina el usuario de la base de datos
            res.json({ mensaje: 'usuario eliminado exitosamente' });
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

        if (user) {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>.,?~\\-]{8,}$/;
            if (regex.test(contrasenia)) {
                // Actualiza los datos del cliente
                user.nombres = nombres;
                user.apellidos = apellidos;
                user.correo = correo;
                user.contrasenia = contrasenia;
                user.sexo = sexo;
                user.fecha_nacimiento = fecha_nacimiento;

                await user.save(); // Guarda los cambios en la base de datos
                res.json(user);
            } else {
                res.status(404).json({ error: 'La clave no cumple con los parametros necesarios' });
            }

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

        if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.contrasenia);

            if (passwordsMatch) {
                // Validar la contraseña
                const contra = 'DinastiaShoes2023';
                const payload = {
                    cedula: user.cedula,
                    tipo: user.tipo
                };


                const token = jwt.sign(payload, contra, {
                    algorithm: "RS256",
                    expireIn: '1h'
                });

                res.json(passwordsMatch);
                
            } else {
                res.status(401).json({ error: 'La clave es incorrecta' });
            }

        } else {
            res.status(404).json({ error: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        res.status(500).json({ error: 'Error al autenticar el usuario1' });
    }
}


module.exports = {
    obtenerUsuario,
    obtenerUnUsuario,
    crearUsuarioAdmin,
    crearUsuarioCliente,
    crearUsuarioEmpleado,
    eliminarUsuarioPorId,
    actualizarUsuarioPorId,
    obtenerUsuarioFiltrado,
    login
};