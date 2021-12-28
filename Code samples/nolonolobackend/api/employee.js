const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee');
const pending = require('../schemas/modulePendingRequest');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');
const path = require('path');
const computePrice = require('../functions/computePrice');
const emailChange = require('../functions/emailCascade');
const sortBy = require('../functions/sortBy');
const express = require('express');
const bcrypt = require('bcrypt');
const checkAvailability = require('../functions/checkAvailability');
const router = express.Router();
const reservations = require('../functions/reservationsHelper');

//và cambiato ma se lascio senza /emp non mi funzionano le altre porchiddio
router.post('/singleEmp', async (req, res) =>
{
    let email = req.body.email;
    let emp = await employee.findOne({email: email});

    if(emp)
    {
        res.status(200).json({emp: emp});
    }else
    {
        res.status(404).json({message: "Error employee not found"});
    }
})
/**
 * Verify if the employee exists in the database. If yes, the employee receive a token
 * @param {email, password}
 * @return {token}
 */
router.post('/login', async (req, res) => {

    const email = req.body.email;

    const source = await employee.findOne({ email: email });
   
    if(source)  // L'account richiesto è stato trovato
    {
        const password = req.body.password;
        
        // We compare the passwords
        if (await bcrypt.compare(password, source.password)) {

            
            // Create the json web token
            const employeeMail = { email: `${source.email}` };
            const accessToken = jwt.sign(employeeMail, process.env.TOKEN_EMPLOYEE_KEY, { expiresIn: '9h' });
            
            //Send token back to client 
             
            res.status(200).json({ accessToken: accessToken});

        } else {
            res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
             
        }
    }else{
        res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
    }
});

/**
 * Gets all the products from the database. Token is checked in order to verify the role.
 * @param jsonwebtoken
 * @return { list of all single products}
 */
router.get('/products', async (req, res) => {

    const products = await product.find();
    if(products)
    {
        res.status(200).json({productList: products});
    }else{
        res.status(500).send("Error with database");
    }
});

/**
 * Make a rental hypothesis impersonating a user.
 * @param { categoryName, userMail, startDate, endDate}
 * @return {available product, computed price, image}
 * @error  Returns error if there is no available product for a given date
 */
router.post('/makeRentalHypothesis', async (req,res) =>{
    const userMail = req.body.email;
    const name = req.body.categoryName;
    const prodName = req.body.productName;
    let startDate = new Date(req.body.startingDate);
    let endDate = new Date(req.body.endingDate);

    if(startDate.getTime() > endDate.getTime())
    {
        let tmp = startDate;
        startDate = endDate;
        endDate = tmp;
    }
    // I find out the collection to send it to the compute price function
    const collection =  await category.findOne({name: name});
    let price;
    let available = true;
    // I find the product on the database and i check if there is an available date
    let prod = await product.findOne({name: prodName});
    if(prod)
    { 
        if(checkAvailability.checkAvailability(prod, startDate, endDate)) {
            
        price = await computePrice.computePrice(collection, prod, userMail, startDate, endDate);
        res.status(200).json({finalPrice: price, availability: available, currProdName: prodName});

     }else
     {
         res.status(200).json({ currProdName: prodName, availability: false});
     }
}else
{
    res.status(404).json({ error: "prodotto non trovato"});
}
});

/**
 * Get all users info from database.
 * @params null
 * @return {users list}
 */
router.get('/getUsersInfo', async (req, res) => {

    const usersList = await user.find();
    if(usersList)
    {
        res.status(200).json({users: usersList});
    }else
    {
        res.status(500).send("Database error");
    }
});

/**
 * Change the defined by email user's entry with the new informations
 * @param {User email, information field to change (type), new information(data)}
 * @return {Succesful operation message}
 * @error Error operation message
 * @summary The user's entry in the database gets updated with new informations, there is
 * a check for integrity.
 */
router.post('/changeUserInfo', async (req, res) => {

    const email = req.body.email;
    const type = req.body.type;
    const newValue = req.body.data;
    let oldValue;
    let source = await user.findOne({ email: email })
    
    if(source)
    {
        switch (type) {
            case 'name':
                source.name = newValue;
                break;
            case 'surname':
                source.surname = newValue;
                break;
            case 'phone':
                source.phone = newValue;
                break;
            case 'email':
                oldValue = source.email;
                source.email = newValue;
                break;
            case 'paymentMethod':
                source.paymentMethod = newValue;
              break;
            }
            // Lo user è modificato
            source.save();
    // Se è la mail la cambio in tutte le prenotazioni dello user, dei prodotti che lui
    // ha prenotato, e in quelle del dipendente, ma anche nelle pending request
            if(newValue === 'email')
                emailChange.emailCascadeChange(source, newValue, oldValue);
            res.status(200).json({message: "Succesful operation"});
    }else
    {
        res.status(500).json({message: "Error during update"});
    }
});

/**
 * Add a product , checks are made client side.
 * @param {product : name, type, quantity, status, price, image}
 * @return {succesful operation message}
 * @error message error
 */
router.post('/addProduct', async (req, res) => {

    const newName = req.body.name;
    const newType = req.body.category;
    const newStatus = req.body.status;
    const newPrice = req.body.price;
    // Check for photo format
    // const file = req.body.file;

    const toAdd = new product({
        name: newName,
        type: newType,
        status: newStatus,
        price: newPrice,
        totalSales: 0,
        numberOfRents: 0
    })

    // Check if the product already exists
    let check = await product.findOne({name: newName});
    if(check)
    {
        res.status(500).send("Element already exists in database");
    }
    else
    {

        let response = await toAdd.save();
        if(response === toAdd)
        {
            res.status(200).json({message: "Succesful operation"})
            // Aggiungo la foto 
            // const dest = path.join('../../nolonoloplus/src/images/', file.name);
            // fs.copyFile(file.path, dest);
        }
        else
            res.status(500).json({message: "Error during operation"})
    }
})  

// REPLACED WITH NEW APIS
// router.post('/deleteProduct', async (req, res) => {

//     const toDelete = req.body.name;
//     const reservations = [];
//     const prod = await product.findOne({name : toDelete})
//     if(prod)
//     {
//         if(prod.activeReservations.length <= 0)
//         {
//             let futureRes = [];
//             futureRes = futureRes.concat(prod.futureReservations);
//             await product.remove({name: toDelete}, function(err)
//             {
//                 if(err)
//                     res.status(500).send(err);
//                 else
//                     res.status(200).json({reservationList: futureRes})
//             })
//         }else
//         {
//             res.status(400).json({message: "The product has active reservations"});
//         }
//     }
// }) 

/**
 * Add a message in the user's comunication area.
 * @param {userMail, message to add}
 * @return {succesful operation}
 * @error error message
 */
router.post('/addComunication', async (req, res) =>{

    const message = req.body.message;
    const userMail = req.body.email;
    let usr =  await user.findOne({email: userMail});
    if(usr)
    {
        usr.communications.push(message);
        usr.save();
        res.status(200).json({message: "Succesful operation"})
    }else
    {
        res.status(404).json({message: "user not found"});
    }
})

/**
 * Update an existing product, the change is valid only for the future reservations.
 * @param {product name and field and relative new value}
 * @return {succesful message}
 * @error error message
 */
router.post('/updateProduct', async (req, res) =>
{
    const name = req.body.name;
    const type = req.body.type;
    const newValue = req.body.data;
    let source = await product.findOne({ name: name })
    
    if(source)
    {
        switch (type) {
            case 'name':
                source.name = newValue;
                break;
            case 'type':
                source.type = newValue;
                break;
            case 'status':
                source.status = newValue;
                break;
            case 'price':
                source.price = newValue;
                break;
            }
            source.save();
            res.status(200).json({message: "Succesful changed"});
    }else
    {
        res.status(500).json({message: "Errore con il database, riprovare più tardi"});
    }
})

/**
 * Create a special reservation on a product so it cannot be reserved anymore for that period.
 * @param {target product name}
 * @return {list of reservations cancelled from product}
 * @summary All the existing reservations in the range of the special one are deleted 
 * and the list of users are returned so that the employee can change the product of the
 * reservation.
 * 
 */
router.post('/maintenance', async (req, res) =>
{
    const productName = req.body.name;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);

    const prod = await product.findOne({name: productName});
    if(prod)
    {
        if(prod.futureReservations)
        {
            let reservationsToChange = [];
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
        // Creo la nuova reservation da aggiungere al prodotto
        let newReserve = reservations.createReservation('maintenance@nolonolo.com', "maintenance@nolonolo.com", productName, 0, startDate, endDate);
        // Aggiungo in testa all'array perchè è già ordinato
        prod.reservations.unshift(newReserve);
        
        // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
        prod.save();
        res.status(200).json({list: reservationsToChange});
    }else
        {
              // Creo la nuova reservation da aggiungere al prodotto
              let newReserve = reservations.createReservation('maintenance@nolonolo.com', "maintenance@nolonolo.com", productName, 0, startDate, endDate);
            prod.futureReservations.push(newReserve);
            // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
            prod.save();
            res.status(200).json({message: "There were no previous reservations"});
        }
    }else{
         
        res.status(500).send("Error, please try again later");
    }
})

/**
 * Create a rental on the product if the employee is verified.
 * @param {necessary rental info}
 * @return {reservation added in product and user if existing}
 * @summary the employee can create a reservation in the past, future or present if 
 * there is availability on the product.
 */
router.post('/makeRental',  async (req, res) => {

    const userMail = req.body.email;
    const employeeMail = req.body.employee;
    const productName = req.body.name;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    const usr = await user.findOne({email: userMail});
    if(usr)
    {
        const prod = await product.findOne({name: productName});
        const emp = await employee.findOne({email: employeeMail});

        if(prod && emp)
        {   
            if(checkAvailability.checkAvailability(prod, startDate, endDate))
            {
                let collection = await category.findOne({name: prod.type});
                let price = await computePrice.computePrice(collection, prod, userMail, startDate, endDate);

                let newReserve = reservations.createReservation(userMail,employeeMail, productName, price, startDate, endDate);
        
                //salvo nel prodotto
                prod.futureReservations.push(newReserve);
                prod.save();

                //salvo nello user
                usr.futureReservations.push(newReserve);
                usr.save();
                //salvo nell'employee
                emp.futureReservations.push(newReserve);
                emp.save();

                res.status(200).json({message: "Added reservation"});
        }else
        {
            res.status(500).json({message: "Product unavailable on these dates"});
        }
    }
    }else
    {
        res.status(500).json({message: "Invalid email inserted"});
    }
})

/** Return all pending requests */
router.get('/pendingRequests', async (req, res) => {

    const reqs = await pending.find();
    if(reqs)
    {
        res.status(200).json({pendingList: reqs});
    }else{
        res.status(500).json({message: "Error with database"});
    }
})
/**
 * Confirm the virtual begin of a rental.
 * @param {pending request plus employee email}
 * @return {successful operation}
 * @summary The employee confirm a pending request and the reservation is added in the user
 * array, in his array and the product number of rents gets updated.
 */
router.post('/confirmBeginOfRental',  async (req, res) => {

    const userMail = req.body.email;
    const employeeMail = req.body.employee;
    const productName = req.body.product;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let price = req.body.expense;
    let id = req.body.id;
    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});
    const emp = await employee.findOne({email: employeeMail});
    if(usr && prod && emp)
    {
        let newReserve = reservations.createReservation(userMail, employeeMail, productName,price, startDate, endDate);
     
        // Aggiungiamo la prenotazione allo user
       usr.futureReservations.push(newReserve);
       usr.save()
        // Aumentiamo il numero di noleggi sul prodotto
       prod.numberOfRents = prod.numberOfRents +1;
       prod.save();

        // Aggiungiamo la prenotazione al dipendente
       emp.futureReservations.push(newReserve);
       emp.save();
        // Cancelliamo la pending request
        await pending.deleteOne({_id: id}, function(err)
        {
            if(err)
                res.status(500).json({message: err});
            else
                res.status(200).json({message: "Succesfully added"})
        });      
    }else
    {
        res.status(500).send("Database internal error, please check your query");
    }
})

/**
 * Employee deny the begin of a rental in the pending requests and a message is written
 * in the comunication area of the user explaining why.
 * @param {userMail, productName, message, start and end date}
 * @summary the rental is erased from product and a message is inserted in the user communication area
 */
router.post('/denyBeginOfRental', async (req, res) => {
    const userMail = req.body.email;
    const productName = req.body.product;
    const message = req.body.message;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    let id = req.body.id;

    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});

    if(usr && prod)
    {
        // Inserisco il messaggio nelle comunicazioni dell'utente
        usr.communications.push(message);
        usr.save();
        
        let x;
        let toChange;
        [toChange, x] = reservations.searchReservation(prod.futureReservations, toChange, x, startDate, endDate);
        if(toChange)
        {
            prod.reservations.splice(x, 1);
            prod.save();
        }
        await pending.deleteOne({_id: id}, function(err)
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

/** Whit this function we actually confirm that the rent started, so 
 * the future res gets cancelled and is moved to the active, in the user and in the employee
 * the amount paid gets updated 
 */
router.post('/confirmLending', async (req, res) => {
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
            [toChange, x] = reservations.searchInProduct(usr.futureReservations, toChange, x, start, end);

            if(toChange)
            {
             //sposto da future ad active
             usr.activeReservations.push(toChange);
             usr.futureReservations.splice(x, 1);
             usr.save();
            }
             // DIPENDENTE
             [toChange, x] = reservations.searchInProduct(emp.futureReservations, toChange, x, start, end);

       
            if(toChange)
            {
             emp.futureReservations.splice(x,  1);
             emp.activeReservations.push(toChange); 
             emp.save();
            }
            //PRODOTTO
       
            [toChange, x] = reservations.searchInProduct(prod.futureReservations, toChange, x, start, end);
            if(toChange)
            {
                prod.futureReservations.splice(x,  1);
                prod.activeReservation = toChange;
                prod.save();
                res.status(200).json({message:"all ok"});
            }
    }else
        {
            res.status(500).send("Internal Database error");
        }
})

/** The employee confirm the user returned the product */
router.post('/confirmEndOfRental', async (req, res) => {  
    const userMail = req.body.user;
    const employeeMail = req.body.employee;
    let productName = req.body.product;
    let start = new Date(req.body.start);
    let end = new Date(req.body.end);
    let expense = req.body.expense;
    let fidelityPoints = req.body.points;
    const emp = await employee.findOne({email: employeeMail});
    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});
    if(usr && emp && prod)
    {
        let toChange ;
        let x;
        // USER
        [toChange, x] = reservations.searchInProduct(usr.activeReservations, toChange, x, start, end)

            if(toChange)
            {
             //sposto da future ad active
             usr.pastReservations.push(toChange);
             usr.activeReservations.splice(x, 1);
             //TO-DO AGGIUNGERE LE ROBE PER STATISTICHE
             usr.amountPaid += expense;
             usr.fidelitypoints += fidelityPoints;
             usr.save();
            }
             // DIPENDENTE
             [toChange, x] = reservations.searchInProduct(emp.activeReservations, toChange, x, start, end)

            for(x in emp.activeReservations)
           
            if(toChange)
            {
             emp.activeReservations.splice(x,  1);
             emp.pastReservations.push(toChange);
            //TO-DO AGGIUNGERE LE ROBE PER STATISTICHE
             emp.totalReservations += 1;
             emp.save();
            }

        //PRODOTTO
       toChange = prod.activeReservation;

        if(toChange)
            {   
                prod.activeReservation = '';
                prod.pastReservations.push(toChange);   
             //TO-DO AGGIUNGERE LE ROBE PER STATISTICHE
                prod.totalSales += expense;
                prod.numberOfRents += 1;
                prod.save();
                res.status(200).json({message: "all ok"});
            }
    }else{
        res.status(404).send("not found");
    }
})
/**
 * Get all future reservations from all products
 * 
 */
router.get('/getAllReservations', async (req, res) => {

    let toSend = [];
    let today = new Date();
    let prods = await product.find({});

    if(prods)
    {
      //Per tutti i prodotti
        for(i in prods) 
        {
            available=true;
            //Per tutte le reservations dei prodotti
            for(j in prods[i].futureReservations)
            {
                let x = prods[i].futureReservations[j];
                //Se inizia dopo oggi
              if(x.start.getTime() >= today.getTime())
              {
                  toSend.push(x);
                  //Se è attiva in questo momento
              }else if(x.start.getTime() < today.getTime() && x.end.getTime() > today.getTime())
               {
                   toSend.push(x);
               }
            }   
        } 
         res.status(200).json({reservations: toSend});
    }else
        return(res.status(500).send(err));
})

/** The employee can modify a rental
 * 
 * 
*/
router.post('/modifyRental', async (req, res) => {
    const productName = req.body.product; // il nuovo prodotto !
    const userMail = req.body.user;
    const employeeMail = req.body.employee;
    const oldProduct = req.body.oldProduct;
    const oldStart = new Date(req.body.oldStart);
    const oldEnd = new Date(req.body.oldEnd);
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);
    //vecchio prodotto per andargli a cambiare le cose
    let prod = await product.findOne({name: oldProduct});
    //user in questione
    let usr = await user.findOne({email: userMail});
    // employee in questione
    let emp = await employee.findOne({email: employeeMail});
  
    if(prod && usr && emp)
    {
        // Cambio dentro il product 
        let toChange;
        let x;
        let newExpense;
        // cerco la vecchia prenotazione nel vecchio prodotto
        [toChange, x] = reservations.searchInProduct(prod.futureReservations, toChange, x, oldStart, oldEnd)
             
        if(toChange)
        {  
            // ... se la trovo la cancello
            prod.futureReservations.splice(x, 1);
            prod.save(); 
            // aggiungo la nuova con i nuovi dati
             let newProd = await product.findOne({name: productName});
            if(newProd)
            {
                 // controllo se è available in quella data prima di mandarla
                 let collection = await category.findOne({name: newProd.type})
                 newExpense = await computePrice.computePrice(collection, newProd, userMail, startDate, endDate)

                const newReserve = reservations.createReservation(userMail, employeeMail, productName, newExpense, startDate, endDate);
            
                //controllo che ci siano prenotazioni e se è disponibile sennò crasha
                if(newProd.futureReservations.length > 0)
                {
                    if( checkAvailability.checkAvailability(newProd, startDate, endDate))
                    {  
                        newProd.futureReservations.push(newReserve);
                        newProd.save();

                    }else
                    {
                        res.status(500).json({message: "Product not available"});
                    }
                }else
                {
                    newProd.futureReservations.push(newReserve);
                    newProd.save();
                }
            } 
        }else{
               return(res.status(500).json({message: "Incorrect or non existent product inserted"}));         
            }
            // USER
               [toChange, x] = reservations.searchReservation(usr.futureReservations, toChange, x, oldStart, oldEnd);
            
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
        
         res.status(200).json({message: "ALL OKK"});
    }else
    {
        res.status(500).json({message: "Product or employee or user non existent"});
    }
})

router.post('/deleteRental', async (req, res) => {
    let oldProduct = req.body.product;
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
        //elimino del prodotto
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

        res.status(200).json({message: 'succesful operation'})
    }else
    {
        res.status(500).json({message: "something went wrong"});
    }
})

router.post('/getPastReservations', async(req, res) => {
    const employeeMail = req.body.email;
    let toSend = [];
    let emp = await employee.findOne({email: employeeMail})
    if(emp)
    {
        toSend.concat(emp.pastReservations);
        res.status(200).json({reservations: toSend})
    }else{
        res.status(404).send("employee not found");
    }
})
module.exports = router;