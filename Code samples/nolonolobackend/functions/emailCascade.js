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
            if (emp.futureReservations.length>0) // se il dipendente ha delle future res
            {
                for (let x in emp.futureReservations) // per tutte le sue future res
                {
                    
                    // se la mail è quella vecchia dello usr 
                    if (emp.futureReservations[x].usermail === oldMail) {
                        emp.futureReservations[x].usermail = newMail;
                    }
                }
            }

            if (emp.activeReservations) // se il dipendente ha delle acrive res
            {
                for (let x in emp.activeReservations.length >0) // per tutte le sue active res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.activeReservations[x].usermail === oldMail) {
                        emp.activeReservations[x].usermail = newMail;
                    }
                }
            }
            if (emp.pastReservations.length > 0) // se il dipendente ha delle past res
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
    console.log("QUI DENTRO");
    for await (let prod of product.find()) { // per tutti i prodotti del database
        if (prods.includes(prod.name)) // se c'è match con quelli che cerco
        {
            console.log("STA DENTRO QUESTO PRODOTTO", prod)
            if (prod.futureReservations.length >0) // se il dipendente ha delle future res
            {
                for (let x in prod.futureReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (prod.futureReservations[x].usermail === oldMail) {
                        prod.futureReservations[x].usermail = newMail;
                    }
                }
            }
            if (prod.activeReservations.length > 0) // se il prod ha una active res
            {
                for (let x in prod.activeReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (prod.activeReservations[x].usermail === oldMail) {
                        prod.activeReservations[x].usermail = newMail;
                    }
                }
            }
            if (prod.pastReservations.length > 0) // se il dipendente ha delle past res
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
        console.log("vecchia mail", oldMail);
        console.log("nuova mail", newMail);
        
        let usr = await user.findOne({email: oldMail});
        console.log("user",usr);
        if (usr) {
            // Dalle prenotazioni dell'utente in question prendo prodotti e dipendenti
            let emps = [];
            let prods = [];
            if (usr.futureReservations) {
                for (let res of usr.futureReservations) {
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
            console.log("prods", prods);
            if (emps.length > 0)
                await changeCascadeEmps(emps, newMail, oldMail);
            if (prods.length > 0)
                await changeCascadeProds(prods, newMail, oldMail);
            checkPendingReqs(newMail, oldMail);
        }
    }
}