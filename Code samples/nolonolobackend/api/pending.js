const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');
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
            console.log(newReserve);
            // aggiungo la pending request
            let newPendingReq = new pendingRequest({
                reserve: newReserve
            })  
            console.log(newPendingReq);
            newPendingReq.save()
            res.status(200).json({message: "Succesful operation"});
        }else
        {
            res.status(500).json({message: "Dates are not available"});
        }
    })
})
/** Deletes the reservation on the product and also the pensing request from database */
router.delete('/:id', async (req, res) => {
    const userMail = req.body.email;
    const productName = req.body.product;
    const message = req.body.message;
    console.log(req.query);
    let startDate = new Date(req.query.start);
    console.log(startDate);
    let endDate = new Date(req.query.end);
    console.log(endDate);
    let id = req.params.id;

    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});

    if(usr && prod)
    {
        // Inserisco il messaggio nelle comunicazioni dell'utente
        usr.communications.push(message);
        usr.save();
        let x;
        let toChange;
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, startDate, endDate);
        // elimino la reservation dal product
        if(toChange)
        {
            prod.futureReservations.splice(x, 1);
            prod.save();
        }
        await pendingRequest.deleteOne({_id: id}, function(err)
        {
            if(err)
                res.status(500).json({message: err});
            else
                res.status(200).json({message: "Succesful operation"})
        }).clone().catch(function(err){
             res.status(500).json({message: "error while deleting pending req"})
            });      
    }else
        res.status(500).json({message: "Error occurred"});
})

module.exports = router;