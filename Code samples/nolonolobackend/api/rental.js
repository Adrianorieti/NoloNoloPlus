const user = require('../schemas/moduleUser');
const employee = require('../schemas/moduleEmployee');
const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const pending = require('../schemas/modulePendingRequest');
const computePrice = require('../functions/computePrice');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const reservations = require('../functions/reservationsHelper');
const router = express.Router();
const sortBy = require('../functions/sortBy');

/**Get all futures and active reservations */
router.get('/', (req, res) => {

    let actives = [];
    let future = [];
    user.find({})
        .exec()
        .then((usr) => {
            for (let i in usr) {
                if (usr[i].activeReservations.length > 0) // mi salvo le attive
                    actives = actives.concat(usr[i].activeReservations)
                if (usr[i].futureReservations.length > 0) // mi salvo le future
                    future = future.concat(usr[i].futureReservations);
            }
            res.status(200).json({ future: future, actives: actives });
        }).catch((err) => {
            res.status(400).json({ message: 'Internal server error' });
        })
})

/** Insert the reservation on the product, the employee and the user 
 * if bool = true the expense must be computed
 * if bool = false expense is already been computed
*/
router.post('/:bool', async (req, res) => {
    let bool = req.params.bool;
    const userMail = req.body.user;
    const productName = req.body.product;
    const employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let expense = req.body.expense;


    //In case dates are swapped
    if (startDate.getTime() > endDate.getTime()) {
        startDate = new Date(req.body.end);
        endDate = new Date(req.body.start);
    }

    const usr = await user.findOne({ email: userMail });
    if (usr) {
        const prod = await product.findOne({ name: productName });
        const emp = await employee.findOne({ email: employeeMail });
        if (prod) {
            if (checkAvailability.checkAvailability(prod, startDate, endDate)) {
                try {
                    let collection = await category.findOne({ name: prod.type });
                    if (bool) // expense deve essere calcolata
                        expense = await computePrice.computePrice(collection, prod, userMail, usr, startDate, endDate);
                    // altrimenti veniamo da una pending request e non dobbiamo calcolarla di nuovo
                    let newReserve = reservations.createReservation(userMail, employeeMail, productName, expense, startDate, endDate, 0);
                    //salvo nel prodotto
                    prod.futureReservations.push(newReserve);
                    prod.save();

                    //salvo nello user
                    usr.futureReservations.push(newReserve);
                    usr.save();

                    //salvo nell'employee
                    emp.futureReservations.push(newReserve);
                    emp.save();
                    res.status(200).json({ message: "Succesful operation" });
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: "Internal server error" });
                }
            } else {
                console.log("not available")
                res.status(500).json({ message: "Product unavailable on these dates" });
            }
        }
    } else {
        res.status(500).json({ message: "Invalid email inserted" });
    }
})

/** Send a product to mantainance */
router.post('/:product/mantainance', async (req, res) => {

    const productName = req.params.product;
    let employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let reservationsToChange = [];
    const prod = await product.findOne({ name: productName });
    if (prod) {
        if (prod.futureReservations.length > 0) {
            // Ordino le prenotazioni per data di inizio
            sortBy.sortByTime(prod.futureReservations, 'start');
            console.log("sorted", prod.futureReservations);
            // Se la data di inizio della prenotazione è <= della data di fine della nostra
            // prenotazione speciale allora và eliminata, e va ritornata 
            for (let i in prod.futureReservations) {
                if (startDate.getTime() >= prod.futureReservations[i].start.getTime() && startDate.getTime() <= prod.futureReservations[i].end.getTime()) {
                    reservationsToChange.push(prod.futureReservations[i]);


                } else if (endDate.getTime() >= prod.futureReservations[i].start.getTime() && endDate.getTime() <= prod.futureReservations[i].end.getTime()) {
                    reservationsToChange.push(prod.futureReservations[i]);


                } else if (startDate.getTime() <= prod.futureReservations[i].start.getTime() && endDate.getTime() >= prod.futureReservations[i].end.getTime()) {
                    reservationsToChange.push(prod.futureReservations[i]);

                } else {
                    break;
                }
            }

            // Creo la nuova reservation da aggiungere al prodotto

            let newReserve = reservations.createReservation('defaultUser@nolonolo.com', employeeMail, productName, 0, startDate, endDate, 0);
            console.log("arrivo fin qui", prod);

            prod.futureReservations.unshift(newReserve);
            // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
            console.log("arrivo fin qui2", prod);

            prod.save();
            console.log("arrivo fin qui3", prod);
            // aggiungo anche la maintenance come pening così è visibile da tutti gli
            // employee
            let newPendingReq = new pending({
                reserve: newReserve
            })
            newPendingReq.save()

            let newReserve = reservations.createReservation('defaultUser@nolonolo.com', employeeMail, productName, 0, startDate, endDate, 0);



            for (let x in reservationsToChange) {
                let newPend = reservations.createReservation(reservationsToChange[x].usermail, " ", reservationsToChange[x].product, reservationsToChange[x].expense, reservationsToChange[x].start, reservationsToChange[x].end, 1);
                newPending = new pending({
                    reserve: newPend
                })
                newPending.save()
            }

            res.status(200).json({ message: "Succesful operation", reservations: reservationsToChange });

        } else {
            res.status(500).json({ message: "Error, please try again later" });
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
    const emp = await employee.findOne({ email: employeeMail });
    const usr = await user.findOne({ email: userMail });
    const prod = await product.findOne({ name: productName });
    console.log("sono qui");
    console.log(usr)

    if (usr && emp && prod) {
        // Sposto la prenotazione da future ad active in modo che lo user non possa
        // modificarla in corso

        let toChange;
        let x;
        //USER
        [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, end, start);

        if (toChange) {
            //sposto da future ad active
            usr.activeReservations.push(toChange);
            usr.futureReservations.splice(x, 1);
            usr.save();
        }
        // DIPENDENTE
        [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x, end, start);


        if (toChange) {
            emp.futureReservations.splice(x, 1);
            emp.activeReservations.push(toChange);
            emp.save();
        }
        //PRODOTTO

        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, end, start);
        if (toChange) {

            prod.futureReservations.splice(x, 1);
            prod.activeReservations.push(toChange);
            prod.save();
            res.status(200).json({ message: "Succesful operation" });
        }
    } else {
        res.status(500).json({ message: "Internal Database error" });
    }
})

router.post('/:product/restitution', async (req, res) => {

    const userMail = req.body.user;
    const employeeMail = req.body.employee;
    let productName = req.params.product;
    let start = new Date(req.body.start);
    let end = new Date(req.body.end);
    let points = req.body.points;
    let expense = req.body.expense;
    const emp = await employee.findOne({ email: employeeMail });
    const usr = await user.findOne({ email: userMail });
    const prod = await product.findOne({ name: productName });
    console.log(req.body);
    if (usr && emp && prod) {
        let toChange;
        let x;
        // USER
        [toChange, x] = reservations.searchReservation(usr.activeReservations, toChange, x, end, start)
        toChange.expense = expense;
        console.log("tochange", toChange);
        if (toChange) {
            //sposto da active a past
            usr.pastReservations.push(toChange);

            usr.activeReservations.splice(x, 1);

            usr.fidelityPoints += parseInt(points);
            usr.amountPaid += parseInt(expense);
            console.log(usr);
            usr.save();
        }
        // DIPENDENTE
        [toChange, x] = reservations.searchReservation(emp.activeReservations, toChange, x, end, start)
        toChange.expense = expense;

        if (toChange) {
            emp.activeReservations.splice(x, 1);

            emp.pastReservations.push(toChange);

            //TO-DO AGGIUNGERE LE ROBE PER STATISTICHE
            emp.totalReservations += parseInt(1);
            emp.save();
        }

        //PRODOTTO
        toChange = prod.activeReservations[0];
        console.log(toChange);
        if (toChange)
            toChange.expense = expense;

        if (toChange) {
            prod.activeReservations = [];

            prod.pastReservations.push(toChange);

            //TO-DO AGGIUNGERE LE ROBE PER STATISTICHE
            prod.totalSales += parseInt(expense);
            prod.numberOfRents += parseInt(1);
            prod.save();
            res.status(200).json({ message: "Succesful operation" });
        }
    } else {
        res.status(500).json({ message: "Internal server error" });
    }
})

/** Modify a rental on the product, the employee and the user */
router.patch('/:product/modify', async (req, res) => {
    console.log("dentro modify");

    const productName = req.body.product; // il nuovo prodotto !
    const userMail = req.body.user;
    const employeeMail = req.body.employee;
    const oldProduct = req.params.product;
    const oldStart = new Date(req.body.oldStart);
    const oldEnd = new Date(req.body.oldEnd);
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    if (startDate.getTime() > endDate.getTime()) {
        startDate = new Date(req.body.start);
        endDate = new Date(req.body.end);
    }
    console.log(req.body)
    console.log(req.params)

    //vecchio prodotto per andargli a cambiare le cose
    let prod = await product.findOne({ name: oldProduct });
    //user in questione
    let usr = await user.findOne({ email: userMail });
    // employee in questione
    let emp = await employee.findOne({ email: employeeMail });
    if (prod && usr && emp) {
        console.log(prod.name)

        let newExpense;
        let newReserve;


        // Cambio dentro il prodotto originale (cancello la vecchia prenotazione)
        let toChange;
        let x;
        // cerco la vecchia prenotazione nel vecchio prodotto
        console.log("vecchio prodotto", prod);
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, oldEnd, oldStart,)
        console.log("Vecchia prenotazione nel prodotto", toChange);
        if (toChange) {
            // ... se la trovo la cancello
            console.log("PRIMA di cancellare", prod.futureReservations);
            prod.futureReservations.splice(x, 1);
            console.log("DOPO", prod.futureReservations);
            prod.save();

        }
        let newProd;
        if (prod.name === productName) {
            newProd = prod;
            console.log("Sono lo stesso oggetto", newProd)
        } else {
            newProd = await product.findOne({ name: productName });
            console.log("Sono oggetti diversi", newProd)

        }

        // Creo la nuova reservation col  prezzo computato
        let collection = await category.findOne({ name: newProd.type })
        newExpense = await computePrice.computePrice(collection, newProd, userMail, usr, startDate, endDate)

        newReserve = reservations.createReservation(userMail, employeeMail, productName, newExpense, startDate, endDate, 0);
        console.log("nuova reservation", newReserve);
        // CONTROLLO SE SUL NUOVO PRODOTTO C'È DISPONIBILITÀ
        // ALTRIMENTI NON SI FA NULLA

        if (newProd.futureReservations.length > 0) {
            console.log("ci sono delle prenotazioni pregresse");
            console.log(newProd.futureReservations);
            if (checkAvailability.checkAvailability(newProd, startDate, endDate)) {
                newProd.futureReservations.push(newReserve);
                newProd.save();


            } else {//se non c'è rimetto a posto quella vecchia ........ voglio morire
                prod.futureReservations.push(toChange);
                prod.save();
                return res.status(500).json({ message: "Product not available" });
            }
        } else {
            console.log(" non ci sono delle prenotazioni pregresse");
            newProd.futureReservations.push(newReserve);
            newProd.save();
        }




        // Vado a cancellarla nello user ed ad aggiungere quella nuova
        [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, oldEnd, oldStart,);
        console.log("dentro lo user è", toChange);

        if (toChange) {
            console.log("dentro lo user è", toChange);
            //cancello quella vecchia
            usr.futureReservations.splice(x, 1);
            usr.futureReservations.push(newReserve);
            usr.save();
        } else {
            return res.status(500).json({ message: "Reservation not found in user" });
        }

        // Cambio nel dipendente
        [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x, oldEnd, oldStart,);

        if (toChange)
            emp.futureReservations.splice(x, 1);

        emp.futureReservations.push(newReserve);
        emp.save();
        console.log("finalmente")
        return res.status(200).json({ message: "Succesfuly changed" });
    } else {
        return res.status(500).json({ message: "Product or employee or user non existent" });
    }
})

/**Deletes a reservation on a product a user and an employee */
router.delete('/:product', async (req, res) => {
    let oldProduct = req.params.product;
    let userMail = req.body.user;
    let employeeMail = req.body.employee;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);

    //vecchio prodotto per andargli a cambiare le cose
    let prod = await product.findOne({ name: oldProduct });
    //user in questione
    let usr = await user.findOne({ email: userMail });
    // employee in questione
    let emp = await employee.findOne({ email: employeeMail });
    if (prod && usr && emp) {
        //elimino dal prodotto
        let x;
        let toChange;
        // cerco la prenotazione nel prodotto
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, endDate, startDate);

        if (toChange) {
            prod.futureReservations.splice(x, 1);
            prod.save();
        }
        // elimino nello user
        [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, endDate, startDate);

        if (toChange) {
            usr.futureReservations.splice(x, 1);
            usr.save();
        }
        //elimino nel dipendente
        [toChange, x] = reservations.searchReservation(emp.futureReservations, toChange, x, endDate, startDate);

        if (toChange) {
            emp.futureReservations.splice(x, 1);
            emp.save();
        }
        res.status(200).json({ message: 'Succesful operation' })
    } else {
        res.status(500).json({ message: "Internal server error" });
    }
})


module.exports = router;