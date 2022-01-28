const employee = require('../schemas/moduleEmployee');
const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const pendingRequest = require('../schemas/modulePendingRequest');

/* Change the old usr mail with the new usr mail in all the corrisponding reservations **/
async function changeCascadeEmps(emps, newMail, oldMail) {
    //per tutti gli impiegati del database
    for await (let emp of employee.find()) {
        // Se trovo un match con quelli che sto cercando
        if (emps.includes(emp.email)) {
            console.log("future res prima", emp.futureReservations)
            if (emp.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in emp.futureReservations) // per tutte le sue future res
                {
                    console.log("new Mail", newMail);
                    console.log("current mail", emp.futureReservations[x].usermail );
                    console.log("old mail", oldMail );

                    // se la mail è quella vecchia dello usr 
                    if (emp.futureReservations[x].usermail === oldMail) {
                        emp.futureReservations[x].usermail = newMail;
                    }
                }
            }
            console.log("future res dopo", emp.futureReservations)

            if (emp.activeReservations) // se il dipendente ha delle acrive res
            {
                for (let x in emp.activeReservations) // per tutte le sue active res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.activeReservations[x].usermail === oldMail) {
                        emp.activeReservations[x].usermail = newMail;
                    }
                }
            }
            if (emp.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in emp.pastReservations) // per tutte le sue past res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.pastReservations[x].usermail === oldMail) {
                        emp.pastReservations[x].usermail = newMail;
                    }
                }
            }
            emp.save();
        }
    }
}
async function changeCascadeProds(prods, newMail, oldMail) {
    for await (let prod of product.find()) { // per tutti i prodotti del database
        if (prods.includes(prod.name)) // se c'è match con quelli che cerco
        {
            if (prod.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in prod.futureReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (prod.futureReservations[x].usermail === oldMail) {
                        prod.futureReservations[x].usermail = newMail;
                    }
                }
            }
            if (prod.activeReservation) // se il prod ha una active res
            {
                for (let x in prod.activeReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (prod.activeReservations[x].usermail === oldMail) {
                        prod.activeReservations[x].usermail = newMail;
                    }
                }
            }
            if (prod.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in prod.pastReservations) // per tutte le sue past res
                {
                    // se la mail è quella vecchia dello usr 
                    if (prod.pastReservations[x].usermail === oldMail) {
                        prod.pastReservations[x].usermail = newMail;
                    }
                }
            }
            prod.save();
        }

    }

}

async function checkPendingReqs(newMail, oldMail) {
    for await (let req of pendingRequest.find({ usermail: oldMail })) {
        req.userMail = newMail;
        req.save();
    }

}

function pushElements(array, element) {
    if (!array.includes(element))
        array.push(element);
}

module.exports = {
    // prodotti che lui ha prenotato, e in quelle del dipendente, ma anche nelle pending request
    emailCascadeChange: async function (newMail, oldMail) {
        console.log('sono dentro cascade email');
        let usr = await user.findOne({ email: oldMail });
        if (usr) {
            // Dalle prenotazioni dell'utente in question prendo prodotti e dipendenti
            let emps = [];
            let prods = [];
            if (usr.futureReservations) {
                for (let res of usr.futureReservations) {
                    console.log(res);
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(prods, res.product);
                        res.email = newMail;
                    }
                }
            }
            if (usr.activeReservations) {
                
                for (let res of usr.activeReservations) {
                    console.log("active",res);
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(prods, res.product);
                        res.email = newMail;
                    }
                }
            }
            if (usr.pastReservations) {
                for (let res of usr.pastReservations) {
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(prods, res.product);
                        res.email = newMail;
                    }
                }
            }
            if (emps.length > 0)
                await changeCascadeEmps(emps, newMail, oldMail);
            if (prods.length > 0)
                await changeCascadeProds(prods, newMail, oldMail);
            checkPendingReqs(newMail, oldMail);
        }
    }
}