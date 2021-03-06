/* Creates products schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* Sub Schema for product map */
const reserveSchema = new Schema({

    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
})

const reservation = mongoose.model('reservation', reserveSchema)
module.exports = reservation;