//WE CREATE THE SCHEMA FOR THE DATABASE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    surname: String,
    phone: Number,
    email: String,
    password: String
});

const user = mongoose.model('user', UserSchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = user;

//ora posso fare var newUser = new user({nome, congnome, età})