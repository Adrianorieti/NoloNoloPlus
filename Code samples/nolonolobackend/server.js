// Authentication module
const auth = require('./auth');

// Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduleUser');
const product = require('./moduleProduct');
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


app.get("/api/dashboard",auth.verifyToken, auth.verifyAdmin, (req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.get("/api/authLog",auth.verifyToken, (req, res) =>
{
    res.sendStatus(200);
});


////// PRODUCT TESTING

let newProduct = new product({
    name: "Bike2000",
    type: "Electric bike",
    price: "300$",
    image: "./images/electric_bike_1",
    reservations: [
        {
            start: "04/10/2020",
            end : "04/16/2020"
        },
        {
            start: "09/04/2020",
            end : "10/04/2020"
        }
    ]
    
});
// MESI-GIORNI-ANNI PORCODIO
const myReservation = [new Date("04/14/2020"), new Date("/04/08/2020")];
// ATTENZIONE, CONSOLE.LOG STAMPA LA DATA IN FORMATO ANNI-MESI-GIORNI
console.log("myReservation : " , myReservation[0])
// if(myReservation[0].getTime() > myReservation[1].getTime())
//     console.log("La prima è più grande")
// else
//     console.log("la seconda è più grande")

// newProduct.save();

async function getProduct(myReservation){ 

    const source = await product.findOne({name: "Bike2000"});

    //provvedere a testare l'efficienza della ricerca sull'array di reservations

    const reservations = source.reservations;
    for(let i in reservations)
    {
        console.log(reservations[i].start)
        if(myReservation[0] > reservations[i].start.getTime() && myReservation[0] < reservations[i].end.getTime() )
            console.log("Non puoi prenotare in questa data");
        else
            console.log("Puoi prenotare")
    }

};

getProduct(myReservation);




app.listen(8001, function () {
    console.log('Server is running on port 8001')
})


//webpack-dev-server --inline --content-base . --history-api-fallback