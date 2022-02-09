const employee = require('../schemas/moduleEmployee');
const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const pendingRequest = require('../schemas/modulePendingRequest');

/* Change the old usr product with the new usr product in all the corrisponding reservations **/
async function changeCascadeEmps(emps, newName, oldName) {
    //per tutti gli impiegati del database
    for await (let emp of employee.find()) {
        // Se trovo un match con quelli che sto cercando
        if (emps.includes(emp.name)) {
            console.log("future res prima", emp.futureReservations)
            if (emp.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in emp.futureReservations) // per tutte le sue future res
                {
                    console.log("new product", newName);
                    console.log("current product", emp.futureReservations[x].product );
                    console.log("old product", oldName );

                    // se la product è quella vecchia dello usr 
                    if (emp.futureReservations[x].product === oldName) {
                        emp.futureReservations[x].product = newName;
                    }
                }
            }
            console.log("future res dopo", emp.futureReservations)

            if (emp.activeReservations) // se il dipendente ha delle acrive res
            {
                for (let x in emp.activeReservations) // per tutte le sue active res
                {
                    // se la product è quella vecchia dello usr 
                    if (emp.activeReservations[x].product === oldName) {
                        emp.activeReservations[x].product = newName;
                    }
                }
            }
            if (emp.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in emp.pastReservations) // per tutte le sue past res
                {
                    // se la product è quella vecchia dello usr 
                    if (emp.pastReservations[x].product === oldName) {
                        emp.pastReservations[x].product = newName;
                    }
                }
            }
            emp.save();
        }
    }
}
async function changeCascadeProds(prods, newName, oldName) {
    for await (let prod of product.find()) { // per tutti i prodotti del database
        if (prods.includes(prod.name)) // se c'è match con quelli che cerco
        {
            if (prod.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in prod.futureReservations) // per tutte le sue future res
                {
                    // se la product è quella vecchia dello usr 
                    if (prod.futureReservations[x].product === oldName) {
                        prod.futureReservations[x].product = newName;
                    }
                }
            }
            if (prod.activeReservation) // se il prod ha una active res
            {
                for (let x in prod.activeReservations) // per tutte le sue future res
                {
                    // se la product è quella vecchia dello usr 
                    if (prod.activeReservations[x].product === oldName) {
                        prod.activeReservations[x].product = newName;
                    }
                }
            }
            if (prod.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in prod.pastReservations) // per tutte le sue past res
                {
                    // se la product è quella vecchia dello usr 
                    if (prod.pastReservations[x].product === oldName) {
                        prod.pastReservations[x].product = newName;
                    }
                }
            }
            prod.save();
        }

    }

}

async function checkPendingReqs(newName, oldName) {
    for await (let req of pendingRequest.find({ userproduct: oldName })) {
        req.product = newName;
        req.save();
    }

}

function pushElements(array, element) {
    if (!array.includes(element))
        array.push(element);
}

module.exports = {
    // prodotti che lui ha prenotato, e in quelle del dipendente, ma anche nelle pending request
    nameCascadeChange: async function (newName, oldName) {
        console.log('sono dentro cascade name');
        let usr = await user.findOne({ name: oldName });
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
                        res.product = newName;
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
                        res.product = newName;
                    }
                }
            }
            if (usr.pastReservations) {
                for (let res of usr.pastReservations) {
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(prods, res.product);
                        res.product = newName;
                    }
                }
            }
            if (emps.length > 0)
                await changeCascadeEmps(emps, newName, oldName);
            if (prods.length > 0)
                await changeCascadeProds(prods, newName, oldName);
            checkPendingReqs(newName, oldName);
        }
    }
}