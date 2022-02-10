/* Creates user schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reserveSchema = require('./moduleReservation').schema;

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
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cap: {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    role: String,
    fidelityPoints: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    communications: [String],
    //prenotazioni future modificabili
    futureReservations: [reserveSchema], // let newRes = new Reservation(ecc..)
    //prenotazioni attive e non modificabili // user.futureReservation.push(newres)
    activeReservations: [reserveSchema],
    //prenotazioni completate
    pastReservations: [reserveSchema],
});

const user = mongoose.model('user', UserSchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = user;

//ora posso fare var newUser = new user({nome, congnome, età})