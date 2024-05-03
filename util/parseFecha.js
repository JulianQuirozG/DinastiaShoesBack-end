const fechaParse = async (fecha) => {
    const fechaSplit = fecha.split('/');
    const dia = fechaSplit[0];
    const mes = fechaSplit[1];
    const anio = fechaSplit[2];

    const fechaObjeto = anio + "-" + mes+ "-" +dia;

    return fechaObjeto;
}

module.exports = { fechaParse }