const employee = require('../schemas/moduleEmployee');
const product = require('../schemas/moduleProduct');
const pendingRequest = require('../schemas/modulePendingRequest');

/* Change the old usr mail with the new usr mail in all the corrisponding reservations **/
async function changeCascadeEmps(emps, newMail, oldMail) {
    //per tutti gli impiegati del database
    for await (const emp of employee.find()) {
        // Se trovo un match con quelli che sto cercando
        if (emps.include(emp.email)) {
            if (emp.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in emp.futureReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.futureReservations[x].userMail === oldMail) {
                        emp.futureReservations[x].userMail = newMail;
                    }
                }
            }
            if (emp.activeReservations) // se il dipendente ha delle future res
            {
                for (let x in emp.activeReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.activeReservations[x].userMail === oldMail) {
                        emp.activeReservations[x].userMail = newMail;
                    }
                }
            }
            if (emp.pastReservations) // se il dipendente ha delle future res
            {
                for (let x in emp.pastReservations) // per tutte le sue future res
                {
                    // se la mail è quella vecchia dello usr 
                    if (emp.pastReservations[x].userMail === oldMail) {
                        emp.pastReservations[x].userMail = newMail;
                    }
                }
            }
            emp.save();
        }
    }
}

async function changeCascadeProds(prods, newMail, oldMail) {
    for await (const prod of product.find()) { // per tutti i prodotti del database
        if (prods.include(prod.name)) // se c'è match con quelli che cerco
        {
            for (let x in prod.reservations) {
                if (prod.reservations[x].userMail === oldMail) {
                    prod.reservations[x].userMail = newMail;
                }
            }
            prod.save();
        }
    }
}

async function checkPendingReqs(newMail, oldMail) {
    for await (const req of pendingRequest.find({ userMail: oldMail })) {
        req.userMail = newMail;
        req.save();
    }
}


module.exports = {
    // prodotti che lui ha prenotato, e in quelle del dipendente, ma anche nelle pending request
    emailCascadeChange: async function (usr, newMail, oldMail) {
        // Dalle prenotazioni dell'utente in question prendo prodotti e dipendenti
        let emps = [];
        let prods = [];
        if (usr.futureReservations) {
            for (let x in usr.futureReservations) {
                if (usr.futureReservations[x].employee) // potrebbe essere ancora in pending
                    emps.push(usr.futureReservations[x].employee)
                prods.push(usr.futureReservations[x].name) // prendo nome del prodotto
            }
        }
        if (usr.activeReservations) {
            for (let x in usr.activeReservations) {
                if (usr.futureReservations[x].employee)
                    emps.push(usr.futureReservations[x].employee)
                prods.push(usr.futureReservations[x].name)
            }
        }
        if (usr.pastReservations) {
            for (let x in usr.pastReservations) {
                if (usr.futureReservations[x].employee)
                    emps.push(usr.futureReservations[x].employee)
                prods.push(usr.futureReservations[x].name)
            }
        }
        if (emps)
            await changeCascadeEmps(emps, newMail, oldMail);
        if (prods)
            await changeCascadeProds(prods, newMail, oldMail);
        checkPendingReqs(newMail, oldMail);
    }
}