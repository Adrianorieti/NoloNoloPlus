const mongoose = require('mongoose');
const schema = mongoose.schema;

const UserSchema = new schema({
    name: String,
    surname: String,
    age: Number
});

const user = mongoose.model('user', UserSchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = user;

//ora posso fare var userRandom = new user({nome, congnome, età})