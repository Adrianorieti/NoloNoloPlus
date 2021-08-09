//express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduledb1');
const app = express();
//cors
var cors = require('cors');
//bcrypt stuff for hashing password
const bcrypt = require('bcrypt');
const { PRIORITY_ABOVE_NORMAL } = require('constants');
//cookies stuff
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const {v4: uuidv4} = require('uuid');

//database url
var url = 'mongodb+srv://Adriano:123Armadiopieno$!$@cluster0.5ajuv.mongodb.net/Nolo?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

<<<<<<< HEAD
app.get('/', function(req, res) {
=======
app.get('/', function (req, res) {
    //res.sendFile('/home/void/Desktop/Git_project/NoloNoloPlus/Code samples/mongo+node/client2.html');
>>>>>>> 0d5d1518a960e656cd9169d280604c9c4c3875e8
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

///////////// cookies stuff

const store = new MongoDBSession({
    uri: url,
    collection: 'sessions',
    isLogged: false,
});

app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false},
    genid: () => uuidv4(),
    store: store,
}));

<<<<<<< HEAD

////////////


=======
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        console.log("not logged in");
    }
}

////////////

app.get('/', function (req, res) {
    //req.session.isAuth = true;
    res.send("Server is on");
});
app.get('/login', isAuth, function (req, res) {
    //req.session.isAuth = true;
    res.send("Logged in");
});
>>>>>>> 0d5d1518a960e656cd9169d280604c9c4c3875e8

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
                password: hash
            });
            //salviamo in mongodb
            newUser.save();

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
<<<<<<< HEAD
            req.session.isLogged= true;
            res.status(200).send();
           
=======
            res.status(200).send({ name: `${source.name}` })
>>>>>>> 0d5d1518a960e656cd9169d280604c9c4c3875e8
        }
        else {
            res.status(500).send({ error: "Password doesn't match" });
            console.log("Password doesn't match");
        }
    }
    else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})

app.listen(8000, function () {
    console.log('Server is running on port 8000')
})
