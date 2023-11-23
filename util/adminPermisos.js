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



module.exports = {

}