// Authentication module
const auth = require('./auth');

// Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduleUser');
const product = require('./moduleProduct');
const category = require('./moduleCategory');
const app = express();

// Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Cross-Origin-Resource-Sharing
var cors = require('cors');

//Bcrypt stuff 
const bcrypt = require('bcrypt');
const { debuglog } = require('util');

//Database url
var url = process.env.URL;

//Connect and start express services
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

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

app.get("/dashboard",(req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


//Server API's

app.post('/api/register', async (req, res) => {

    const mail = req.body.email;

    const source = await user.findOne({ email: mail });

    if (!(source)) 
    {
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
            const user = { name: `${source.name}`};
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, {expiresIn: '1h'});

            //Send token back to client 
            res.json({ accessToken: accessToken ,name: `${source.name}`});

        } else {
            console.log("Password doesn't match");
        }
    }else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})

app.get('/products', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/api/dashboard",auth.verifyToken, auth.verifyAdmin, (req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.get("/api/authLog",auth.verifyToken, (req, res) =>
{
    res.sendStatus(200);
});

app.get('/api/products', async(req, res) =>
{
 //qui semplicemente prendiamo tutti i prodotti ( le categorie) dal database e le torniamo indietro


})


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
  
   if(token === null || token === undefined) // Non siamo loggati 
   {
           
            const prod =  await category.findOne({name: name});

            if(prod)
            {
                //TO-DO capire il checkout ed il prezzo
                let price = prod.price;
                let period = endDate.getTime() - startDate.getTime();
                period = period / (1000 *3600 * 24);
                price = price * period;
                res.status(200).json({prod: prod, finalPrice: price});
            }
   

   }else{ // l'utente è loggato e quindi bisogna verificare il token per poi procedere 

    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        if(err) res.status(500).send(err);
        //se usavo category per la variabile mi dava errore
        const collection =  await category.findOne({name: name});
        //il nome della categoria è il tipo dei prodotti
        let typeToFind = collection.name;

        if(collection)
        {
            //TO-DO capire il checkout ed il prezzo
            let price = collection.price;
            let period = endDate.getTime() - startDate.getTime();
            period = period / (1000 *3600 * 24);
            price = price * period;
            //ANDIAMO A VEDERE SUI SINGOLI PRODOTTI SE C'È DISPONIBILITÀ
            //l'utente loggato può sapere la disponibilità
            let collision = false;

        const prodList = await product.find({type: typeToFind}, function(err, db){
        if(err) res.status(500).send(err);
        for(i in db)
        {
            for(j in db[i].reservations)
            {
                let x = db[i].reservations[j];
                // nei primi due if controlliamo che inizio o fine della prenotazione richiesta
                //sia nel mezzo di un'altra, nell'ultimo se ne contiene un'altra già esistente
                if( startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime() )
                {
                    collision = true;

                }else if( endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime())
                {
                    collision = true;
                }else if(x.start.getTime() <= startDate.getTime() &&  x.end.getTime() <= endDate.getTime())
                {
                    collision = true
                }
            }   
        }
       
        res.status(200).json({prod: prod, finalPrice: price, availability: collision});
       
        })
    }
})
} 
});


////// PRODUCT TESTING

// let newProduct = new product({
//     name: "Bike2000",
//     quantity: 1,
//     status: "New",
//     type: "Electric",
//     reservations: [
//         {
//             start: "04/10/2020",
//             end : "04/16/2020"
//         },
//         {
//             start: "09/04/2020",
//             end : "10/04/2020"
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
// newProduct.save();
// newProduct2.save();
// newProduct3.save();

app.listen(8001, function () {
    console.log('Server is running on port 8001')
})


//webpack-dev-server --inline --content-base . --history-api-fallback