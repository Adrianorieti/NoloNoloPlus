const user = require('../schemas/moduleUser');
const employee = require('../schemas/moduleEmployee');
const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
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

/** Insert the reservation on the product, the employee and the user 
 * if bool = true the expense must be computed
 * if bool = false expense is already been computed
*/
router.post('/:bool', async (req, res) => {
    let bool = req.params.bool;
    const userMail = req.body.email;
    const productName = req.body.product;
    const employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let expense = req.body.expense;
    const usr = await user.findOne({email: userMail});
    if(usr)
    {
        const prod = await product.findOne({name: productName});
        const emp = await employee.findOne({email: employeeMail});
        if(prod)
        {   
            console.log("arrivato sin qui");
            if(checkAvailability.checkAvailability(prod, startDate, endDate))
            {
                try{
                    let collection = await category.findOne({name: prod.type});
                    if(bool) // expense deve essere calcolata
                        expense = await computePrice.computePrice(collection, prod, userMail, usr, startDate, endDate);
                        // altrimenti veniamo da una pending request e non dobbiamo calcolarla di nuovo
                    let newReserve = reservations.createReservation(userMail,employeeMail, productName, expense, startDate, endDate);
                    console.log(newReserve);
                    //salvo nel prodotto
                    prod.futureReservations.push(newReserve);
                    prod.save();
                    //salvo nello user
                    usr.futureReservations.push(newReserve);
                    usr.save();
                    //salvo nell'employee
                    emp.futureReservations.push(newReserve);
                    emp.save();

                    res.status(200).json({message: "Succesful operation"});
                }catch(err)
                {
                    res.status(500).json({message: err});
                }
            }
        }else
        {
            res.status(500).json({message: "Product unavailable on these dates"});
        }
    }else
    {
        res.status(500).json({message: "Invalid email inserted"});
    }
})
module.exports = router;