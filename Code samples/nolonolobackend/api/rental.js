const user = require('../schemas/moduleUser');
const employee = require('../schemas/moduleEmployee');
const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const reservations = require('../functions/reservationsHelper');
const router = express.Router();

/**Get all futures and active reservations */
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
    console.log("ENTRATO QUA PORCODIOOOOO")
    let bool = req.params.bool;
    const userMail = req.body.user;
    const productName = req.body.product;
    const employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let expense = req.body.expense;
   
    //In case dates are swapped
    if(startDate.getTime() > endDate.getTime())
    {
        startDate = new Date(req.body.end);
        endDate = new Date(req.body.start);
    }
  
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
                console.log("qui dentro");
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
                    console.log("qui");

                    //salvo nello user
                    usr.futureReservations.push(newReserve);
                    usr.save();
                    console.log("qui ");

                    //salvo nell'employee
                    emp.futureReservations.push(newReserve);
                    emp.save();
                    console.log("arrivo qui");
                    res.status(200).json({message: "Succesful operation"});
                }catch(err)
                {
                    console.log(err);
                    res.status(500).json({message: err});
                }
            }else
            {
                console.log("not available")
                res.status(500).json({message: "Product unavailable on these dates"});
            }
        }
    }else
    {
        res.status(500).json({message: "Invalid email inserted"});
    }
})
/** Send a product to mantainance */
router.post('/:name/mantainance', async (req, res) => {

    const productName = req.params.name;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let reservationsToChange = [];

    const prod = await product.findOne({name: productName});
    if(prod)
    {
        if(prod.futureReservations)
            {
                // Ordino le prenotazioni per data di inizio
                sortBy.sortByTime(prod.futureReservations, 'start');
                // Se la data di inizio della prenotazione è <= della data di fine della nostra
                // prenotazione speciale allora và eliminata, e va ritornata 
                for(let i in prod.futureReservations)
                {
                    // SE INIZIA PRIMA CHE DOVREBBE FINIRE LA MANUTENZIONE
                if(prod.futureReservations[i].start.getTime() <= endDate.getTime())
                    {
                        // Salvo la prenotazione
                        reservationsToChange.push(prod.futureReservations[i]);
                        // La elimino dal prodotto
                        prod.futureReservations.splice(i, 1);

                    }else if(prod.futureReservations[i].start.getTime() > endDate.getTime())
                    {
                        // Esco dal for perchè ho superato il periodo di mio interesse
                        break;
                    }
                }
            }
            
            // Creo la nuova reservation da aggiungere al prodotto
            
            let newReserve = reservations.createReservation('maintenance@nolonolo.com', "maintenance@nolonolo.com", productName, 0, startDate, endDate);
            
            prod.futureReservations.unshift(newReserve);
            
            // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
            
            prod.save();
            
            res.status(200).json({reservations: reservationsToChange});
        
    }else{
         
        res.status(500).send("Error, please try again later");
    }

})

/** Whit this function we actually confirm that the rent started, so 
 * the future res gets cancelled and is moved to the active, in the user and in the employee
 * the amount paid gets updated 
 */
 router.post('/active/confirm', async (req, res) => {
    // Ricevo la prenotazione dalla lista delle future res dei dipendenti
    const userMail = req.body.user;
    const employeeMail = req.body.employee;
    let productName = req.body.product;
    let start = new Date(req.body.start);
    let end = new Date(req.body.end);
    const emp = await employee.findOne({email: employeeMail});
    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});
    

    if(usr && emp && prod)
    {
        // Sposto la prenotazione da future ad active in modo che lo user non possa
        // modificarla in corso

            let toChange ;
            let x;
            //USER
            [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, start, end);

            if(toChange)
            {
             //sposto da future ad active
             usr.activeReservation = toChange;
             usr.futureReservations.splice(x, 1);
             usr.save();
            }
             // DIPENDENTE
             [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x, start, end);


            if(toChange)
            {
             emp.futureReservations.splice(x,  1);
             emp.activeReservations.push(toChange); 
             emp.save();
            }
            //PRODOTTO

            [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, start, end);
            if(toChange)
            {
                prod.futureReservations.splice(x,  1);
                prod.activeReservation = toChange;
                prod.save();
                res.status(200).json({message:"Succesful operation"});
            }
    }else
        {
            console.log("errore");
            res.status(500).json({message: "Internal Database error"});
        }
})

/** Modify a rental on the product, the employee and the user */
router.patch('/:product/modify', async(req, res) => {
        const productName = req.body.product; // il nuovo prodotto !
        const userMail = req.body.user;
        const employeeMail = req.body.employee;
        const oldProduct = req.params.product;
        const oldStart = new Date(req.body.oldStart);
        const oldEnd = new Date(req.body.oldEnd);
        let startDate = new Date(req.body.start);
        let endDate = new Date(req.body.end);
        console.log("1");
        if(startDate.getTime() > endDate.getTime())
        {
            startDate = new Date(req.body.start);
            endDate = new Date(req.body.end);
        }
        console.log("start", startDate.getDate());
        console.log("end", endDate.getDate());
        //vecchio prodotto per andargli a cambiare le cose
        let prod = await product.findOne({name: oldProduct});
        //user in questione
        let usr = await user.findOne({email: userMail});
        // employee in questione
        let emp = await employee.findOne({email: employeeMail});
        if(prod && usr && emp)
        {
            let newProd = await product.findOne({name: productName});
            let newExpense;
            let newReserve;

            if(newProd)
                {
                    // Creo la nuova reservation col  prezzo computato
                     let collection = await category.findOne({name: newProd.type})
                     newExpense = await computePrice.computePrice(collection, newProd, userMail, usr, startDate, endDate)
    
                     newReserve = reservations.createReservation(userMail, employeeMail, productName, newExpense, startDate, endDate);
                
                    // CONTROLLO SE SUL NUOVO PRODOTTO C'È DISPONIBILITÀ
                    // ALTRIMENTI NON SI FA NULLA
                    console.log("2");

                    if(newProd.futureReservations.length > 0)
                    {
                        if( checkAvailability.checkAvailability(newProd, startDate, endDate))
                        {  
                            newProd.futureReservations.push(newReserve);
                            newProd.save();
                            console.log("3");

    
                        }else
                        {
                            res.status(500).json({message: "Product not available"});
                        }
                    }else
                    {
                        newProd.futureReservations.push(newReserve);
                        newProd.save();
                    }
                }else{
                   return(res.status(500).json({message: "Incorrect or non existent product inserted"}));         
                }

            // Cambio dentro il prodotto originale (cancello la vecchia prenotazione)
            console.log("5");

            let toChange;
            let x;
            // cerco la vecchia prenotazione nel vecchio prodotto
            [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, oldStart, oldEnd)
            console.log("6");

            if(toChange)
            {  
                // ... se la trovo la cancello
                prod.futureReservations.splice(x, 1);
                prod.save();
                console.log("7");

            } 
         
            // Vado a cancellarla nello user ed ad aggiungere quella nuova
                   [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, oldStart, oldEnd);
                   console.log("8");

             if(toChange)
            {
                //cancello quella vecchia
                usr.futureReservations.splice(x, 1);
                usr.futureReservations.push(newReserve);
                usr.save();
            }else
            {
                res.status(500).json({message: "not found in employee"});
            }
    
            // Cambio nel dipendente
             [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x , oldStart, oldEnd);         
    
             if(toChange)
                emp.futureReservations.splice(x,  1);
             
             emp.futureReservations.push(newReserve);
             emp.save();
            
             res.status(200).json({message: "Succesfuly changed"});
        }else
        {
            res.status(500).json({message: "Product or employee or user non existent"});
        
}
})

router.delete('/:product', async (req, res) => {
    let oldProduct = req.params.product;
    let userMail = req.body.user;
    let employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    //vecchio prodotto per andargli a cambiare le cose
    let prod = await product.findOne({name: oldProduct});
    //user in questione
    let usr = await user.findOne({email: userMail});
    // employee in questione
    let emp = await employee.findOne({email: employeeMail});
  
    if(prod &&  usr && emp)
    {
        //elimino dal prodotto
        let x;
        let toChange;
        // cerco la prenotazione nel prodotto
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, endDate, startDate);

        if(toChange)
        {
            prod.futureReservations.splice(x, 1);
            prod.save();
        }     
        // elimino nello user
        [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, endDate, startDate);

        if(toChange)
        {   
             usr.futureReservations.splice(x, 1);
             usr.save();
        } 
        //elimino nel dipendente
        [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x, endDate, startDate);

        if(toChange)
        {    
            emp.futureReservations.splice(x, 1);
            emp.save();
        }

        res.status(200).json({message: 'Succesful operation'})
    }else
    {
        res.status(500).json({message: "Internal server error"});
    }
})
module.exports = router;