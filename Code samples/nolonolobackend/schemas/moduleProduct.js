/* Creates products schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reserveSchema = require('./moduleReservation').schema;


const ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    futureReservations: [reserveSchema],
    activeReservations: [reserveSchema],
    pastReservations: [reserveSchema],
    totalSales: {
        type: Number,
        required: true
    },
    numberOfRents: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
})


const product = mongoose.model('product', ProductSchema);
module.exports = product;
