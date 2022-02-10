const employee = require('../schemas/moduleEmployee');
const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const pendingRequest = require('../schemas/modulePendingRequest');

/* Change the old prod product with the new prod product in all the corrisponding reservations **/
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

                    // se la product è quella vecchia dello prod 
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
                    // se la product è quella vecchia dello prod 
                    if (emp.activeReservations[x].product === oldName) {
                        emp.activeReservations[x].product = newName;
                    }
                }
            }
            if (emp.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in emp.pastReservations) // per tutte le sue past res
                {
                    // se la product è quella vecchia dello prod 
                    if (emp.pastReservations[x].product === oldName) {
                        emp.pastReservations[x].product = newName;
                    }
                }
            }
            emp.save();
        }
    }
}
async function changeCascadeUsers(users, newName, oldName) {
    for await (let usr of user.find()) { // per tutti gli users del database
        if (users.includes(usr.email)) // se c'è match con quelli che cerco
        {
            if (usr.futureReservations) // se il dipendente ha delle future res
            {
                for (let x in usr.futureReservations) // per tutte le sue future res
                {
                    // se la product è quella vecchia dello prod 
                    if (usr.futureReservations[x].product === oldName) {
                        usr.futureReservations[x].product = newName;
                    }
                }
            }
            if (usr.activeReservations) // se il prod ha una active res
            {
                for (let x in usr.activeReservations) // per tutte le sue future res
                {
                    // se la product è quella vecchia dello prod 
                    if (usr.activeReservations[x].product === oldName) {
                        usr.activeReservations[x].product = newName;
                    }
                }
            }
            if (usr.pastReservations) // se il dipendente ha delle past res
            {
                for (let x in usr.pastReservations) // per tutte le sue past res
                {
                    // se la product è quella vecchia dello prod 
                    if (usr.pastReservations[x].product === oldName) {
                        usr.pastReservations[x].product = newName;
                    }
                }
            }
            usr.save();
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
        let prod = await product.findOne({ name: oldName });
        if (prod) {
            // Dalle prenotazioni dell'utente in question prendo prodotti e dipendenti
            let emps = [];
            let users = [];
            if (prod.futureReservations) {
                for (let res of prod.futureReservations) {
                    console.log(res);
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(users, res.usermail);
                        res.product = newName;
                    }
                }
            }
            if (prod.activeReservations) {
                
                for (let res of prod.activeReservations) {
                    console.log("active",res);
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(users, res.usermail);
                        res.product = newName;
                    }
                }
            }
            if (prod.pastReservations) {
                for (let res of prod.pastReservations) {
                    if (res.employee) // potrebbe essere ancora in pending
                    {
                        pushElements(emps, res.employee);
                        pushElements(users, res.usermail);
                        res.product = newName;
                    }
                }
            }
            if (emps.length > 0)
                await changeCascadeEmps(emps, newName, oldName);
            if (users.length > 0)
                await changeCascadeUsers(users, newName, oldName);
            checkPendingReqs(newName, oldName);
        }
    }
}