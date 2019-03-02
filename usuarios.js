const mongoose = require ('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    timeStamp: {type: String, required: true},
    rol: {type: String, required: true}
});

module.exports = mongoose.model('users', userSchema);
