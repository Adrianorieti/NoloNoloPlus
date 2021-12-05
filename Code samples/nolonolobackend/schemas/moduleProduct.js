/* Creates products schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* Sub Schema for product map */
const reserveSchema = new Schema({

    usermail: {
        type: String,
        required: true
    },
    employee: {
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
    expense: { // costo del noleggio
        type: Number
    }
})

const ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    type : {
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
    reservations: [reserveSchema],
    totalSales: {
        type: Number,
    },
    numberOfRents: {
        type: Number,
    }
})


const product = mongoose.model('product', ProductSchema); 
module.exports = product;
