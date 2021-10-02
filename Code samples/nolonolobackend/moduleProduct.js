/* Creates products schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Sub Schema for product map */
const reserveSchema = new Schema({

    start: {
        type: 'String',
        required: true
    },
    end: {
        type: 'String',
        required: true
    }
})

const ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reservations: [reserveSchema],
})

const product = mongoose.model('product', ProductSchema); 
module.exports = product;
