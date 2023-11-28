const Usuario = require('../models/usuarioModel'); // Importa el modelo de usuario

const validarAdmin = async (usuario) =>{
    try{
        let validar;
        
        if(usuario=='A'){
            return true;
        }
        
        return false;

    }
    catch(error){
        console.error('Usuario invalido');
        return false;
    }
}


function verificarPermisos(usuario, permisosRequeridos) {
    if (!usuario || !usuario.permisos || !usuario.tipo) {
        return false;
    }

    // Verificar el valor del atributo "tipo"
    switch (usuario.tipo) {
        case 'C':
            // Los administradores tienen acceso a todos los permisos
            return true;
        case 'A':
            // Los usuarios normales pueden tener permisos específicos
            return permisosRequeridos.every(permiso => usuario.permisos.includes(permiso));
        // Otros casos según tus necesidades
        default:
            return false;
    }
}



module.exports = {
    verificarPermisos,
}