const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reserveSchema = require('./moduleReservation').schema;

const pendingRequestSchema = new Schema({

    reserve: reserveSchema
});

const pendingRequest = mongoose.model('pendingRequest', pendingRequestSchema)
module.exports = pendingRequest;