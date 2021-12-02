/* Creates user schema for database */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Sub Schema for product map */
const reserveSchema = new Schema({

    usermail: {
        type: String,
        required: true
    },
    name: { //nome dell'oggetto che andiamo a noleggiare!
        type: String,
        required: true
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

const employeeSchema = new Schema({
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
    role:{ 
        type: String,
        required: true
    },
    totalReservations: Number,
    //prenotazioni future modificabili
    futureReservations: [reserveSchema],
    //prenotazioni attive
    activeReservations: [reserveSchema],
    //prenotazioni passate
    pastReservations: [reserveSchema]
});

const employee = mongoose.model('employee', employeeSchema); 
module.exports = employee;
