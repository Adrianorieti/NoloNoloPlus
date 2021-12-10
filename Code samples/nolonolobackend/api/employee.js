const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee');
const pending = require('../schemas/modulePendingRequest');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const reservation = require('../schemas/moduleReservation');
const user = require('../schemas/moduleUser');
const path = require('path');
const fs = require('fs');
const computePrice = require('../functions/computePrice');
const emailChange = require('../functions/emailCascade');
const auth = require('./auth');
const sortBy = require('../functions/sortBy');
const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router();

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
            const employee = { email: `${source.email}` };
            const accessToken = jwt.sign(employee, process.env.TOKEN_EMPLOYEE_KEY, { expiresIn: '9h' });
            
            //Send token back to client 
            console.log("Success");
            res.status(200).json({ accessToken: accessToken});

        } else {
            res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
            console.log("Password doesn't match");
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

    // Check if the user is perculing us
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
        console.log(prod.reservations);
        if(prod.reservations)
        {
            for( let i in prod.reservations) 
            {
                        let x = prod.reservations[i];
                        if( startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime() )
                        {
                            console.log("Sono qui1")
                            available = false;
                            break; 
                        }else if( endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime())
                        { 
                            console.log("Sono qui2")
                            available = false;                    
                            break;
                        }else if( startDate.getTime() <= x.start.getTime()  &&  endDate.getTime() >=  x.end.getTime())
                        {
                            console.log("Sono qui3")
                            available = false;
                            break;
                        }
            }
        }
    if(available) {
        price = await computePrice.computePrice(collection, prod, userMail, startDate, endDate);
        res.status(200).json({finalPrice: price, availability: available, currProdName: prodName});
     }else
     {
        console.log(prodName);
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
    console.log(email);
    console.log(type);
    console.log(newValue);
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
        console.log("sono qui dentro");
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
/**
 * Elimina il prodotto specificato dal dipendente solo se non ci sono prenotazioni attive, ritornando la lista di prenotazioni
 * presente su quel prodotto.
 * @param {productName}
 * @return {list of future reservations on product}
 * @error Se ci sono prenotazioni attive
 */
router.post('/deleteProduct', async (req, res) => {

    const toDelete = req.body.name;
    const reservations = [];
    const source = await product.findOne({name : toDelete})
    if(source)
    {
        // Controllare se sia meglio push o concat
        reservations.concat(source.reservations);
        // TEST PER VEDERE SE FUNZIONA VISTO CHE NON ABBIAMO RESERVATIONS NEI PRODOTTI
        let start = new Date("12-01-2021");
        let end = new Date("12-05-2021");
        let start2 = new Date("12-10-2021");
        let end2 = new Date("12-15-2021");
        let start3 = new Date("12-28-2021");
        let end3 = new Date("12-30-2021");
        let newReserve = new reservation({
            usermail: "PROVAPROVA@gmail.com",
            start: start,
            end: end
        })
        let newReserve2 = new reservation({
            usermail: "PROVAPROVA@gmail.com",
            start: start2,
            end: end2
        })
        let newReserve3 = new reservation({
            usermail: "PROVAPROVA@gmail.com",
            start: start3,
            end: end3
        })
        reservations.push(newReserve2);
        reservations.push(newReserve);
        reservations.push(newReserve3);

        // Da tenere
        sortBy.sortByTime(reservations, 'start');
        var today = new Date();

        /**Se vedo che ci possono essere delle prenotazioni attive */
        if(reservations[0].start.getTime() <= today.getTime())
        {   
            /** Scorro tutto l'array per vedere se trovo delle prenotazioni attive, se trovo o supero esco */
            for(let x in reservations)
            {
                // Se trovo una reservation a cavallo cioè ancora attiva
                if(reservations[x].start.getTime() <= today.getTime() && reservations[x].end.getTime() >= today.getTime())
                {
                    console.log("PRODUCT STILL HAS ACTIVE RES");
                    break;
                    // return res.status(500).json({error: "Operation impossible, product still has active reservations"});
                    
                }else if(reservations[x].start.getTime() > today.getTime())
                {
                    console.log("OK potrei anche cancellarlo");
                    //Cancello dall'array delle prenotazioni tutte quelle passate
                    let newReservations = reservations.slice(x);
                    console.log(newReservations);
                    break;
                    // Mando la lista di prenotazioni future
                    // await product.remove({name: toDelete}, function(err)
                    // {
                    //     if(err)
                    //         res.status(500).send(err);
                    //     else
                    //         res.status(200).json({reservationList: newReservations})
                    
                    // });
                }
            }
        }else
        {
            console.log("OK potrei anche cancellarlo");
                    // Mando la lista di prenotazioni future senza cancellare nulla
                    // await product.remove({name: toDelete}, function(err)
                    // {
                    //     if(err)
                    //         res.status(500).send(err);
                    //     else
                    //         res.status(200).json({reservationList: reservations})
                    
                    // });
        }
        
    }
})

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
        console.log(usr);
        usr.communications.push(message);
        usr.save();
        res.status(200).json({message: "Succesful operation"})
    }else
    {
        console.log("user not found");
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
        let reservations = prod.reservations;
        if(reservations)
        {
            let reservationsToChange = [];
            // Ordino le prenotazioni per data di inizio
            sortBy.sortByTime(reservations, 'start');
            // Controllo se ci sono prenotazioni
        // Se la data di inizio della prenotazione è <= della data di fine della nostra
        // prenotazione speciale allora và eliminata, e va ritornata 
        for(let i in reservations)
        {

            // Se ci sono ancora prenotazioni  passate vengono cancellate
            // ?????? cosa giusta da fare ????? e se poi accade qualcosa dove andiamo
            // a guardare ?
            if(reservations[i].end.getTime() < startDate.getTime())
            reservations.splice(i, 1);
            // qui sono sicuro che è compresa    
            else if(reservations[i].start.getTime() <= endDate.getTime())
            {
                // Salvo la prenotazione
                reservationsToChange.push(reservations[i]);
                // La elimino dal prodotto
                reservations.splice(i, 1);
                
            }else if(reservations[i].start.getTime() > endDate.getTime())
            {
                // Esco dal for perchè ho superato il periodo di mio interesse
                break;
            }
        }

        // Creo la nuova reservation da aggiungere al prodotto
        let newReserve = new reservation({
            usermail: "maintenance@maintenance",
            start: `${startDate}`,
            end: `${endDate}`
        })
        // Aggiungo in testa all'array perchè è già ordinato
        prod.reservations.unshift(newReserve);
        
        // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
        prod.save();
        console.log("all ok");
        res.status(200).json({list: reservationsToChange});
    }else
    {
        console.log("all ok but no previous reservations");

          // Creo la nuova reservation da aggiungere al prodotto
          let newReserve = new reservation({
            usermail: "maintenance@maintenance",
            start: `${startDate}`,
            end: `${endDate}`
        })
        // Aggiungo nuovamente il prodotto che sarà virtualmente in manutenzione
        prod.save();
        res.status(200).json({message: "There were no previous reservations"});

    }
        
    }else{
        console.log("product error");
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
    const productName = req.body.name;
    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);

    console.log(startDate.getDate());
    console.log(endDate.getDate());

    const source = await user.findOne({email: userMail});

    if(source)
    {
        const prod = await product.findOne({name: productName});
    if(prod)
    {
        let reservations = prod.reservations;
        sortBy.sortByTime(reservations, 'start');
        let available = true;
        if(reservations)
        {
            for(i in reservations)
            {
                if( startDate.getTime() >= reservations[i].start.getTime() && startDate.getTime() <= reservations[i].end.getTime() )
                {
                    console.log("l'inizio è compreso");
                    available = false;
                    break; // passo all'oggetto successivo non guardo tutte le altre reservation di quell'oggetto

                }else if( endDate.getTime() >= reservations[i].start.getTime() && endDate.getTime() <= reservations[i].end.getTime())
                {
                    console.log("la fine  è compresa");

                    available = false;
                    break;

                }else if( startDate.getTime() <= reservations[i].start.getTime()  &&  endDate.getTime() >=  reservations[i].end.getTime())
                {
                    console.log("comprende tutto");
                    available = false;
                    break;
                }else
                {
                    // essendo ordinato appena trovo una inferiore esco dal for
                    break;
                }
            }
        }   
        if(available)
        {
            let collection = await category.findOne({name: prod.type});
            let price = await computePrice.computePrice(collection, prod, userMail, startDate, endDate);

                let newReserve = new reservation({
                    usermail: userMail,
                    start: `${startDate}`,
                    end: `${endDate}`,
                    expense: `${price}`
            })

            prod.reservations.push(newReserve);
            prod.save();
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
    console.log(req.body);

    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});
    const emp = await employee.findOne({email: employeeMail});
    if(usr && prod && emp)
    {
        let newReserve = new reservation({
            usermail: `${userMail}`,
            employee: `${employeeMail}`,
            product: `${productName}`,
            start: `${startDate}`,
            end: `${endDate}`,
            expense: price
    })
    console.log(newReserve);

        // Aggiungiamo la prenotazione allo user
       usr.futureReservations.push(newReserve);
       usr.save()
        // Aumentiamo il numero di noleggi sul prodotto
       prod.numberOfRents = prod.numberOfRents +1;
       prod.save();

       let newReserve2 = new reservation({
        usermail: `${userMail}`,
        product: `${productName}`,
        start: `${startDate}`,
        end: `${endDate}`,
        expense: price
        })
        console.log(newReserve2);
        // Aggiungiamo la prenotazione al dipendente
       emp.futureReservations.push(newReserve2);
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
    const productName = req.body.name;
    const message = req.body.message;
    let startDate = new Date(req.body.startingDate);
    let endDate = new Date(req.body.endingDate);

    const usr = await user.findOne({email: userMail});
    const prod = await product.findOne({name: productName});

    if(usr && prod)
    {
        // Inserisco il messaggio nelle comunicazioni dell'utente
        usr.comunications.push(message);
        usr.save();
        // Rendo di nuovo libero il prodotto
        let reservations = prod.reservations;
        let reserve = reservations.find(item=> { item.start === startDate  && item.end=== endDate } );
        if(reserve)
        {
            prod.reservations.splice(reservations.indexOf(reserve), 1);
            prod.save();
        }
    }

})
/** The employee confirm that the user took the product */
router.post('/confirmLending', async (req, res) => {
    // Ricevo la prenotazione dalla lista dei dipendenti
    const userMail = req.body.email;
    const productName = req.body.name;
    const employeeMail = req.body.employee;
    let startDate = new Date(req.body.startingDate);
    let endDate = new Date(req.body.endingDate);
    const emp = employee.findOne({email: employeeMail});
    const usr = user.findOne({email: userMail});
    if(usr && emp)
    {
        // Sposto la prenotazione da future ad active in modo che lo user non possa
        // modificarla in corso
       let toChange =  usr.futureReservations.find(item=> { item.start === startDate  && item.end=== endDate } );
       if(toChange)
       {
            usr.futureReservations.splice(futureReservations.indexOf(toChange), 1);
            usr.activeReservations.push(toChange);
            usr.save();
        }
        // Sposto la prenotazione tra le attive del dipendente
        emp.futureReservations.splice(futureReservations.indexOf(toChange), 1);
        emp.activeReservations.push(toChange);
        emp.save();
        res.status(200).send("Succesful operation");
    }else
    {
        res.status(500).send("Internal Database error");
    }

})

/** The employee confirm the user returned the product */
router.post('/confirmEndOfRental', async (req, res) => {

    const userMail = req.body.email;
    const employee = req.body.employee;
    const endDate = new Date(req.body.endingDate);
    const productName = req.body.name;
    const pointsToAdd = req.body.points;
    let emp = await employee.findOne({email: employee});
    let usr = await user.findOne({email: userMail});
    if(usr && emp)
    {
        // Trovo la prenotazione nelle active dell'utente
        let toChange = usr.activeReservations.find(item=> { item.end === endDate  && item.name=== productName } );
        // La elimino dalle attive e la metto nelle passate
        usr.activeReservations.slice(indexOf(toChange), 1);
        usr.pastReservations.push(toChange);
        //Cambio i fidelity points dello user
        usr.fidelityPoints += pointsToAdd; // controllare se sia stringa o numero
        usr.save();

        //Faccio lo stesso con il dipendente, qui faccio di nuovo la ricerca perchè gli schemas sono diversi per ora
        toChange = emp.activeReservations.find(item=> { item.end === endDate  && item.name=== productName } );

        emp.activeReservations.slice(indexOf(toChange), 1);
        emp.pastReservations.push(toChange);
        emp.save();

        res.status(200).send("ok");
    }else{
        res.status(404).send("not found");
    }
})
/**
 * Get all future reservations from all products
 * 
 */
router.post('/getAllReservations', async (req, res) => {

    let toSend = [];
    let today = new Date();
    product.find({},  async function(err, db){

        if(err) return(res.status(500).send(err));
        //Per tutti i prodotti
    for(i in db) 
    {
        available=true;
        //Per tutte le reservations dei prodotti
        for(j in db[i].reservations)
        {
            let x = db[i].reservations[j];
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
    res.status(200).json({listOfReservations: toSend}); 

})
})

/** The employee can modify a rental */
router.post('/modifyRental', async (req, res) => {
    const productName = req.body.name;
    const userMail = req.body.email;
    const employeeMail = req.body.employee;
    let startDate = new Date(req.body.startingDate);
    let endDate = new Date(req.body.endingDate);

    let prod = await product.findOne({name: productName});
    let usr = await user.findOne({email: userMail});
    let emp = await employee.findOne({email: employeeMail});
    if(prod && usr && emp)
    {
        // Cambio dentro il product
        let toChange = prod.reservations.find(item=> { item.end === endDate  && item.userMail=== userMail } );
        prod.reservations.slice(indexOf(toChange), 1);
        const newReserve = new reservation({
            usermail: userMail,
            start: startDate,
            end: endDate
        })
        prod.reservations.push(newReserve);
        prod.save();

        // Cambio nello user
         toChange = usr.futureReservations.find(item=> { item.end === endDate  && item.name=== productName } );
        usr.futureReservations.slice(indexOf(toChange), 1);
         newReserve = new reservation({
            name: productName,
            start: startDate,
            end: endDate
        })
        usr.futureReservations.push(newReserve);
        usr.save();
        // Cambio nel dipendente
         toChange = emp.futureReservations.find(item=> { item.end === endDate  && item.name === productName && item.usermail === userMail } );
        emp.futureReservations.slice(indexOf(toChange), 1);
         newReserve = new reservation({
            usermail: userMail,
            name: productName,
            start: startDate,
            end: endDate
        })
        emp.futureReservations.push(newReserve);
        emp.save();

        res.status(200).send("all ok");
    }else
    {
        res.status(500).send("internal server error");
    }
})

router.post(' /getPastReservations ', async(req, res) => {
    const employeeMail = req.body.email;
    let toSend = [];
    let emp = await employee.findOne({email: employeeMail})
    if(emp)
    {
        toSend.concat(emp.pastReservations);
        res.status(200).json({listOfPastReservations: toSend})
    }else{
        res.status(404).send("employee not found");
    }
})
module.exports = router;