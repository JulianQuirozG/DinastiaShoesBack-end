const Carrito = require('../models/carritoModel');
const Cliente = require('../models/clienteModel'); // Importa el modelo de usuario
const Usuario = require('../models/usuarioModel');

//Listar clientes
async function obtenerClientes(req, res) {
    try {
        const client = await Usuario.findAll({
            // attributes: { exclude: ['createdAt', 'updatedAt'] }
            include: [{
                model: Cliente,
                where: {
                    eliminado: "0",
                }
            }]
        });
        return res.json(client);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
}

//Obtener un cliente
async function obtenerUnCliente(req, res) {
    const { cedula } = req.params;
    try {
        const client = await Usuario.findByPk(cedula, {
            // attributes: { exclude: ['createdAt', 'updatedAt'] }
            include: [{
                model: Cliente,
            },]
        });
        return res.json(client);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
}

//CREAR UN PRODUCTO
async function crearCliente(req, res) {
    const { cedula, departamento, municipio, direccion_completa, informacion_complementaria, telefono } = req.body;

    try {

        const user = await Usuario.findByPk(cedula);
        const emp = await Cliente.findByPk(cedula);

        if(emp){
            emp.departamento=departamento;
            emp.municipio=municipio;
            emp.direccion_completa=direccion_completa;
            emp.informacion_complementaria=informacion_complementaria;
            emp.telefono=telefono;
            emp.eliminado = "0";
            emp.save();
            return  res.json(emp);
        }

        if (user.tipo == "C") {
            const nuevoClient = await Cliente.create({
                cedula,
                departamento,
                municipio,
                direccion_completa,
                informacion_complementaria,
                telefono,
                eliminado: "0"
            });

            const carrito = await Carrito.create({
                cliente_cedula: cedula,
            });

            return res.json(nuevoClient);
        } else {
            return res.status(500).json({ error: 'El usuario no es de tipo cliente' });
        }
        // Crea un nuevo cliente en la base de datos

    } catch (error) {
        console.error('Error al guardar la informacion del cliente:', error);
        return res.status(500).json({ error: 'Error al guardar la informacion del cliente' });
    }
}

//ELIMINAR UN cliente
async function eliminarClientePorId(req, res) {
    const { cedula } = req.params;
    //await console.log("codigo: ", cedula);
    try {
        const client = await Cliente.findByPk(cedula);
        //console.log(cliente);
        if (client) {
            client.eliminado = "1"
            await client.save(); // Elimina el producto de la base de datos
            return res.json({ mensaje: 'Informacion del cliente eliminada exitosamente' });
        } else {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar la informacion del cliente:', error);
        return res.status(500).json({ error: 'Error al eliminar la Informacion del cliente' });
    }
}


//actualizar por id
async function actualizarClientePorId(req, res) {
    const { cedula } = req.params;
    const { departamento, municipio, direccion_completa, informacion_complementaria, telefono } = req.body;

    try {
        const client = await Cliente.findByPk(cedula);

        if (client) {
            // Actualiza los datos del cliente
            client.departamento = departamento;
            client.municipio = municipio;
            client.direccion_completa = direccion_completa;
            client.informacion_complementaria = informacion_complementaria;
            client.telefono = telefono;
            client.eliminado = "0";

            await client.save(); // Guarda los cambios en la base de datos
            return res.json(client);
        } else {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}


module.exports = {
    obtenerClientes,
    obtenerUnCliente,
    crearCliente,
    eliminarClientePorId,
    actualizarClientePorId,
};