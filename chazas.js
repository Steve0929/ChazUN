const mongoose = require ('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const chazaSchema = new Schema({
    nombre: {type: String, required: true},
    administrador: {type: String, required: true},
    celular: {type: String, required: false},
    latitud: {type: String, required: true},
    longitud: {type: String, required: true},
    descripcion: {type: String, required: true},
    productos: [{producto: String, precio: String}],
    calificaciones: [{calificacion: Number, calificador: String}],
    comentarios: [{comentario: String, autor: String}],
    horario: {type: String, required: true},
    calificacion: {type: String, required: false, default: 0},
    categoria: {type: String, required: true}
});

module.exports = mongoose.model('chazas', chazaSchema);
