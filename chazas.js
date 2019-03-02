const mongoose = require ('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const chazaSchema = new Schema({
    nombre: {type: String, required: true},
    administrador: {type: String, required: true},
    celular: {type: String, required: false},
    latitud: {type: Number, required: true},
    longitud: {type: Number, required: true},
    descripcion: {type: String, required: true},
    productos: [{producto: String, precio: Number}],
    calificaciones: [{calificacion: Number, calificador: String}],
    comentarios: [{comentario: String, autor: String}],
    horario: {type: String, required: true},

});

module.exports = mongoose.model('chazas', chazaSchema);
