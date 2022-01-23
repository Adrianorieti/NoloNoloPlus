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
/** Add pending request : creates a temporary reservation on a  product and insert a new pending request */
router.post('/:name', auth.verifyToken, (req, res) => {
    let userMail = req.email;
    let price = req.body.price;
    let productName = req.params.name;
    let start = new Date(req.body.start);
    let end = new Date(req.body.end);

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

/** Deletes the reservation on the product and also the pending request from database */
router.delete('/:id', async (req, res) => {
    const userMail = req.body.email;
    const productName = req.body.product;
    let message = req.body.message;
    let startDate = new Date(req.query.start);
    let endDate = new Date(req.query.end);
    let id = req.params.id;

    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});

    if(usr && prod)
    {
        if(message === '')
        {  
              message = `Your rental of ${productName} with start ${startDate.toDateString()} and end ${endDate.toDateString()} has been accepted, thank you for choosing us !`;
        }    
        // Inserisco il messaggio nelle comunicazioni dell'utente
        usr.communications.push(message);
        usr.save();
        let x;
        let toChange;
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x,endDate, startDate);
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