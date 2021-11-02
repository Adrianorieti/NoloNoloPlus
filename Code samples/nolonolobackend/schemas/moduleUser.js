/* Creates user schema for database */
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
    },
    name: { //nome dell'oggetto che andiamo a noleggiare!
        type: String,
        required: true
    }
})

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
    fidelityPoints: Number,
    amountPaid: Number,
    //prenotazioni future modificabili
    futureReservations: [reserveSchema],
    //prenotazioni completate
    pastReservations: [reserveSchema]
});

const user = mongoose.model('user', UserSchema); // crei uno user e sarà in questa collezione, questo sarà il modello e quello sarà lo schema
module.exports = user;

//ora posso fare var newUser = new user({nome, congnome, età})