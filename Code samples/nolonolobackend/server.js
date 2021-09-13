
const {localstorage} = require('node-localstorage');

//Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduledb1');
const app = express();

//Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Cross-Origin-Resource-Sharing
var cors = require('cors');

//Bcrypt stuff 
const bcrypt = require('bcrypt');

//Database url
var url = 'mongodb+srv://Adriano:123Armadiopieno$!$@cluster0.5ajuv.mongodb.net/Nolo?retryWrites=true&w=majority';

//Connect and start express services
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));



//Verify identity of user requesting url
 function verifyToken(req, res, next)
 {
     //retrieve the token from request header
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        console.log("nome utente " + decoded.name);

        if(err) 
        {
            console.log(err.name);
            return res.status(403).send(` ${err.name} `);
        }

       
    
        next();
    })
 }

 function verifyAdmin(req, res, next)
 {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        if(err) 
        {
            console.log(err.name);
            return res.status(403).send(` ${err.name} `);
        }

        console.log(decoded.name);

        const source =  await user.findOne({ name: decoded.name });
        console.log(source);
        if(source.role !== 'admin')
        {
            return res.status(403).send(` Only an admin can access this page`);

        }

    
        next();
    })
 }

//Server API

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get('/login', function (req, res) {

    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.post('/register', async (req, res) => {

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
    const source = await user.findOne({ email: mail });
    if (source) {

        const password = req.body.password;
        
        const buff = Buffer.from(password, 'base64');
        const decodedpass = buff.toString('utf-8');


        if (await bcrypt.compare(decodedpass, source.password)) {

            console.log("Success");

            //CREATE  JWT
            const user = { name: `${source.name}`};
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, {expiresIn: '1h'});

            //Send token back to client toghether with user name
            res.json({ accessToken: accessToken ,name: `${source.name}`});

        } else {
            console.log("Password doesn't match");
        }
    }else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})


app.get("/api/dashboard",verifyToken, verifyAdmin, (req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.get("/dashboard",(req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});



app.listen(8001, function () {
    console.log('Server is running on port 8001')
})
