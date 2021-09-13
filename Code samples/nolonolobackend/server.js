require('dotenv').config();

const {localstorage} = require('node-localstorage');
//express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduledb1');
const app = express();

const jwt = require('jsonwebtoken');

//cors
var cors = require('cors');
//bcrypt stuff for hashing password
const bcrypt = require('bcrypt');

// //cookies stuff
// const session = require('express-session');
// const MongoDBSession = require('connect-mongodb-session')(session);
// const { v4: uuidv4 } = require('uuid');

//database url
var url = 'mongodb+srv://Adriano:123Armadiopieno$!$@cluster0.5ajuv.mongodb.net/Nolo?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));




 function verifyToken(req, res, next)
 {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if(token == null) return res.sendStatus(401);
    console.log("Sono qui dio caneeeeeeeee");
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

////////////////////////////////////////////

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/login', function (req, res) {

    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.post('/register', async (req, res) => {

    const mail = req.body.email;

    //guardo se c'è già una mail registrata
    const source = await user.findOne({ email: mail });

    if (!(source)) //se non c'è una copia della mail nel db
    {
        //la password arriva in base64
        const password = req.body.password;

        //qui la decodifico
        const buff = Buffer.from(password, 'base64');
        const decodedpass = buff.toString('utf-8');


        //qui faccio l'hash della password con sale
        const hash = await bcrypt.hash(decodedpass, 10, function (err, hash) {

            let newUser = new user({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: req.body.email,
                password: hash,
                role: 'customer'
            });
            //salviamo in mongodb
            newUser.save();
            res.status(200).send();
            

        })
    } else {
        console.log(' Errore esiste già la mail');
        res.status(500).send({ error: 'Mail already exists' });
    }
});



app.post('/login', async (req, res) => {
    const mail = req.body.email;
    const source = await user.findOne({ email: mail });
    if (source) {

        const password = req.body.password;
        //qui la decodifico
        const buff = Buffer.from(password, 'base64');
        const decodedpass = buff.toString('utf-8');

        //utilizzo compare di bcrypt per comparare la password in plain text e il suo ipotetico hash
        //ci riesce perchè ha uno schema di cifratura che glielo permette da quanto ho capito

        if (await bcrypt.compare(decodedpass, source.password)) {
            console.log("Success");
            // req.session.isLogged = true;
            
            //CREARE IL JWT
            const user = { name: `${source.name}`};
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, {expiresIn: '1h'});

            
            res.json({ accessToken: accessToken ,name: `${source.name}`});

            // res.send({ name: `${source.name}`, isLogged: `${req.session.isLogged}` });

        }
        else {
            console.log("Password doesn't match");
        }
    }
    else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})

//nel server
app.get("/dashboard", (req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get("/api/dashboard",verifyToken, verifyAdmin, (req, res) => 
{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});



app.listen(8001, function () {
    console.log('Server is running on port 8001')
})

//react-script start