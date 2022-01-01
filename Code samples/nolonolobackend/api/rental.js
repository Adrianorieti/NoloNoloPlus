const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const pendingRequest = require('../schemas/modulePendingRequest');
const auth = require('./auth');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const reservations = require('../functions/reservationsHelper');
const router = express.Router();

/**Get all futures and active resevations */
router.get('/', (req, res) => {

    let actives = [];
    let future = [];
   product.find({})
    .exec()
    .then((prods) => {
        for(i in prods) 
        {
            if(prods[i].activeReservation != null) // mi salvo le attive
                actives.push(prods[i].activeReservation)
            if(prods[i].futureReservations) // mi salvo le future
                future =  future.concat(prods[i].futureReservations);
        } 
         res.status(200).json({future: future, actives: actives});
    }).catch((err) => {
        res.status(400).json({ message: 'Internal server error'});
    })
})

/** Insert the reservation on the product, the employee and the user */
router.post('/', (req, res) => {
    
})
module.exports = router;