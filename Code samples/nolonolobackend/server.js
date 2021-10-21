// Authentication module
const auth = require('./auth');

// Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduleUser');
const product = require('./moduleProduct');
const category = require('./moduleCategory');
const reservation = require('./moduleReservation');
const app = express();

// Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Cross-Origin-Resource-Sharing
var cors = require('cors');

//Bcrypt stuff 
const bcrypt = require('bcrypt');

//Database url
var url = process.env.URL;

//Connect and start express services
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));


// These API's answer an url query with static files
// This is required so the client can use React routes

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get('/login', function (req, res) {

    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get("/personalpage", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Server API's

app.post('/api/register', async (req, res) => {

    const mail = req.body.email;

    const source = await user.findOne({ email: mail });

    if (!(source)) {
        //password arrives in base-64
        const password = req.body.password;

        //password is decoded
        const buff = Buffer.from(password, 'base64');
        const decodedpass = buff.toString('utf-8');


        //password is hashed and salted
        const hash = await bcrypt.hash(decodedpass, 10, function (err, hash) {

            let newUser = new user({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: req.body.email,
                password: hash,
                role: 'customer'
            });

            //user is saved in mongodb
            newUser.save();

            res.status(200).send();


        })
    } else {
        console.log(' Errore esiste già la mail');
        res.status(500).send({ error: 'Mail already exists' });
    }
});



app.post('/api/login', async (req, res) => {

    const mail = req.body.email;

    //We check if user exists in database
    const source = await user.findOne({ email: mail });

    if (source) {

        const password = req.body.password;

        const buff = Buffer.from(password, 'base64');

        const decodedpass = buff.toString('utf-8');

        // If user exists we compare the password
        if (await bcrypt.compare(decodedpass, source.password)) {

            console.log("Success");

            //CREATE  JWT
            const user = { name: `${source.name}` };
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, { expiresIn: '1h' });

            //Send token back to client 
            res.json({ accessToken: accessToken, name: `${source.name}` });

        } else {
            console.log("Password doesn't match");
        }
    } else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})



app.get("/api/dashboard", auth.verifyToken, auth.verifyAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.get("/api/authLog", auth.verifyToken, (req, res) => {
    res.sendStatus(200);
});

app.post('/api/products', async (req, res) => {
    let prodList = [];
    //questo ci aiuta ad iterare su tutti gli elementi della collezione
 for await (const doc of category.find()) {
    prodList.push(doc);
  }
  res.status(200).json({prodList: prodList});
})  

// esegue l'update  su una reservation di un prodotto specifico
//prende il nome di un prodotto, l'inizio della reservation e la fine
app.post('/api/updateRent', async(req, res) =>{

    let productName = req.body.name;
    let startDate = req.body.startingDate;
    let endDate = req.body.endingDate;
    console.log(productName)
    console.log(startDate)
    console.log(endDate)
    let prod = await product.findOne({name: productName});
    console.log(prod);
    let newReserve = new reservation({
        start: `${startDate}`,
        end: `${endDate}`
    })
    console.log(newReserve);
    //il giro dell'oca
    let newReservations =  prod.reservations;
    newReservations.push(newReserve);
//vado a fare l'update dell'array di reservations
     product.updateOne({ name: productName }, {
        reservations: newReservations
      });})
      
app.post('/api/formProducts', async(req, res) =>
{
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
    console.log("Il token è", token);
   const name = req.body.name;
   const startDate = new Date(req.body.startingDate);
   const endDate = new Date(req.body.endingDate);

   if(startDate.getTime() > endDate.getTime())
   {
       let tmp = startDate;
       startDate = endDate;
       endDate = tmp;
   }
  
   if(token) //  Siamo loggati 
   {
    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        if(err) 
            console.log(err);

        //PRENDO LA CATEGORIA DELL'OGGETTO
        const collection =  await category.findOne({name: name});
        //il nome della categoria è il tipo dei prodotti
        let typeToFind = collection.name;
        if(collection)
        {
            //TO-DO capire il checkout ed il prezzo+
            let price ;
            let period = endDate.getTime() - startDate.getTime();
            // let price = collection.price;
            // period = period / (1000 * 3600 * 24);
            // price = price * period;
            //ANDIAMO A VEDERE SUI SINGOLI PRODOTTI SE C'È DISPONIBILITÀ
            //l'utente loggato può sapere la disponibilità
            let available = false;
            let currentProd;
            //ATTENZIONE notare che nei prodotti cerchiamo per tipo, e se si guarda il database
            //si può notare che il nome della categoria (Electric S_300 )è poi il tipo dei prodotti
            //che però possono avere dei nomi diversi perchè magari di marche diverse
          product.find({type: typeToFind},   function(err, db){
            // await new Promise(r => setTimeout(r, 2000));
        if(err) return(res.status(500).send(err));
        console.log(db);
        for(i in db) 
        {
            available=true;

            for(j in db[i].reservations)
            {
                let x = db[i].reservations[j];
              
                // nei primi due if controlliamo che inizio o fine della prenotazione richiesta
                //sia nel mezzo di un'altra, nell'ultimo se ne contiene un'altra già esistente
                if( startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime() )
                {
                    console.log("l'inizio è compreso");
                    available = false;
                    break; // passo all'oggetto successivo non guardo tutte le altre reservation di quell'oggetto

                }else if( endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime())
                {
                    console.log("la fine  è compresa");

                    available = false;
                    break;

                }else if( startDate.getTime() <= x.start.getTime()  &&  endDate.getTime() >=  x.end.getTime())
                {
                    console.log("comprende tutto");
                    available = false;
                    break;
                }

            }   

           if(available)
            {
                currentProd = db[i].name;
                price = db[i].price;
                period = period / (1000 * 3600 * 24);
                price = price * period;
                console.log('currentProd', currentProd);
                res.status(200).json({prod: collection, finalPrice: price, availability: available, currProdName: currentProd});
                break;
            }

        }
    })
    }
})
}else{ // l'utente non è loggato quindi calcoliamo la media del prezzo 
    
    const prod =  await category.findOne({name: name});

    if(prod)
    {
        //TO-DO capire il checkout ed il prezzo
        let price = prod.price;
        let period = endDate.getTime() - startDate.getTime();
        period = period / (1000 *3600 * 24);
        price = price * period;
        return(res.status(200).json({prod: prod, finalPrice: price}));
    }
}
});




////// PRODUCT TESTING

// let newProduct = new product({
//     name: "Electric S_300",
//     quantity: 1,
//     status: "New",
//     type: "Electric",
//     reservations: [
//         {
//             start: "06/10/2020",
//             end : "08/16/2020"
//         },
//         {
//             start: "10/04/2020",
//             end : "11/04/2020"
//         }
//     ]});

//     let newProduct2 = new product({
//         name: "Bike2000",
//         quantity: 1,
//         status: "New",
//         type: "Electric",
//         reservations: [
//             {
//                 start: "05/10/2020",
//                 end : "05/16/2020"
//             },
//             {
//                 start: "09/04/2020",
//                 end : "10/04/2020"
//             }
//         ]});
// let newProduct3 = new product({
//     name: "Bike2000",
//     quantity: 1,
//     status: "New",
//     type: "Electric",
//     reservations: [
//         {
//             start: "02/10/2020",
//             end : "03/16/2020"
//         },
//         {
//             start: "06/24/2020",
//             end : "07/04/2020"
//         }
//     ]});

//newCategory.save();
//newProduct.save();
// newProduct2.save();
// newProduct3.save();

app.listen(8001, function () {
    console.log('Server is running on port 8001');
});


 