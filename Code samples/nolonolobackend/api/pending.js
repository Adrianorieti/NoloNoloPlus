const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const pendingRequest = require('../schemas/modulePendingRequest');
const auth = require('./auth');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const reservations = require('../functions/reservationsHelper');
const router = express.Router();

/** Get all pending requests */
router.get('/', (req, res) => {

    pendingRequest.find({})
    .exec()
    .then((requests) => {
        res.status(200).json({requests: requests});
    })
    .catch((err) => {
        res.status(500).json({ message: 'Internal error', error: err })
    })
})
/** Creates a temporary reservation on a  product and insert a new pending request */
router.post('/:name', auth.verifyToken, (req, res) => {
    let userMail = req.email;
    let price = req.body.price;
    let productName = req.params.name;
    let start = new Date(req.body.start);
    start.setDate(start.getDate() +1);
    let end = new Date(req.body.end);
    end.setDate(end.getDate() +1);

    product.findOne({name: productName}) // cerco il prodotto in questione
    .exec()
    .then((prod) => {

        if(checkAvailability.checkAvailability(prod, start, end))
        {
            //aggiungo la prenotazione sul prodotto momentaneamente
            let newReserve = reservations.createReservation(userMail," ",productName, price, start, end);
            prod.futureReservations.push(newReserve);
            prod.save();

            // aggiungo la pending request
            let newPendingReq = new pendingRequest({
                reserve: newReserve
            })  
            newPendingReq.save()
            res.status(200).json({message: "Succesful operation"});
        }else
        {
            res.status(500).json({message: "Dates are not available"});
        }
    })
})

module.exports = router;