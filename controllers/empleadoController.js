const Empleado = require('../models/empleadoModel'); // Importa el modelo de usuario
const Usuario = require('../models/usuarioModel');

//Listar Empleado
async function obtenerEmpleados(req, res) {
    try {
        const emple = await Usuario.findAll({
            include: [{
                model: Empleado,
            }]
        });
        res.json(emple);
    } catch (error) {
        console.error('Error al obtener informacion de los empleados:', error);
        res.status(500).json({ error: 'Error al obtener la informacion de los empleados.' });
    }
}

//Obtener un Empleado
async function obtenerUnEmpleado(req, res) {
    const { cedula } = req.params;
    try {
        const emple = await Usuario.findByPk(cedula, {
            include: [{
                model: Empleado,
            }]
        });
        res.json(emple);
    } catch (error) {
        console.error('Error al obtener Empleado', error);
        res.status(500).json({ error: 'Error al obtener Empleado' });
    }
}

//CREAR indo de UN empleado
async function crearEmpleado(req, res) {
    const { cedula, inventario, ventas } = req.body;
    try {

        const emple = await Usuario.findByPk(cedula);

        if (emple.tipo == "E") {
            const nuevoEmple = await Empleado.create({
                cedula,
                inventario,
                ventas
            });

            res.json(nuevoEmple);
        } else {
            res.status(500).json({ error: 'El usuario no es de tipo Empleado' });
        }
        // Crea un nuevo Empleado en la base de datos

    } catch (error) {
        console.error('Error al guardar la informacion del Empleado:', error);
        res.status(500).json({ error: 'Error al guardar la informacion del Empleado' });
    }
}

//ELIMINAR UN Empleado
async function eliminarEmpleadoPorId(req, res) {
    const { cedula } = req.params;
    try {
        const emple = await Empleado.findByPk(cedula);
        if (emple) {
            await emple.destroy(); // Elimina el info de un empleado de la base de datos
            res.json({ mensaje: 'Informacion del empleado eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'empleado no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar la informacion del empleado:', error);
        res.status(500).json({ error: 'Error al eliminar la Informacion del empleado' });
    }
}


//actualizar por id
async function actualizarEmpleadoPorId(req, res) {
    const { cedula } = req.params;
    const { inventario, ventas } = req.body;

    try {
        const emple = await Empleado.findByPk(cedula);

        if (emple) {
            emple.inventario = inventario;
            emple.ventas = ventas;

            await emple.save(); // Guarda los cambios en la base de datos
            res.json(emple);
        } else {
            res.status(404).json({ error: 'info del empleado no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar la info del empleado:', error);
        res.status(500).json({ error: 'Error al actualizar la info del empleado' });
    }
}


module.exports = {
    obtenerEmpleados,
    obtenerUnEmpleado,
    crearEmpleado,
    eliminarEmpleadoPorId,
    actualizarEmpleadoPorId,
};