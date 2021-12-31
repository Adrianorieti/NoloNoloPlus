/* Creates user schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reserveSchema = require('./moduleReservation').schema;

/* Sub Schema for product map */
// const reserveSchema = new Schema({

//     usermail: {
//         type: String
//     },
//     start: {
//         type: Date,
//         required: true
//     },
//     end: {
//         type: Date,
//         required: true
//     },
//     product: { //nome del prodotto singolo
//         type: String,
//         required: true
//     },
//     employee: {
//         type: String
//     },
//     expense: { // costo del noleggio
//         type: Number
//     }
// })

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
    email:
    {
        type: String,
        required: true
    },
    password: {
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