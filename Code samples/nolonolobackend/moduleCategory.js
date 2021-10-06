/* Creates user schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const category = mongoose.model('category', CategorySchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = category;

//ora posso fare var newUser = new user({nome, congnome, età})