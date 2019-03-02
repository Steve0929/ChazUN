const mongoose = require ('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const chazaSchema = new Schema({
    nombre: {type: String, required: true},
    administrador: {type: String, required: false},
    celular: {type: String, required: false},
    latitud: {type: String, required: true},
    longitud: {type: String, required: true},
    descripcion: {type: String, required: true},
    productos: {type: String, required: true},
    calificaciones: [{calificacion: Number, calificador: String}],
    comentarios: [{comentario: String, autor: String}]
});

module.exports = mongoose.model('chazas', chazaSchema);
