/* Creates products schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* Sub Schema for product map */
const reserveSchema = new Schema({

    usermail: {
        type: String,
    },
    product: {
        type: String
    },
    employee: {
        type: String
    },
    name: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    expense: {
        type: Number,
        required: true
    }
})

const reservation = mongoose.model('reservation', reserveSchema)
module.exports = reservation;