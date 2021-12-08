const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingRequestSchema = new Schema({

  
    usermail: {
        type: String,
        required: true
    },
    product: {
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
    expense: {
        type: Number
    }
});

const pendingRequest = mongoose.model('pendingRequest', pendingRequestSchema)
module.exports = pendingRequest;