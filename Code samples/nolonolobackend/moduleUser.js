/* Creates user schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: 
    {
        type: String,
        required: true
    },
    phone: 
    {
        type: Number,
        required: true
    },
    email: 
    {
        type: String,
        required: true
    },
    password: { 
        type :String,
        required: true
    },
    role: String
});

const user = mongoose.model('user', UserSchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = user;

//ora posso fare var newUser = new user({nome, congnome, età})