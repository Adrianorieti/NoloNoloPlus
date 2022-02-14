const jwt = require('jsonwebtoken');
require('dotenv').config();
const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const employee = require('../schemas/moduleEmployee');
const express = require('express');
const router = express.Router();

/**
 * Given a password and a mail, returns ok if the password is associated with the given email, unauthorized otherwise.
 * @param {email, password}
 * @return {200, 401}
 */
router.post('/passw-validation', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        return res.sendStatus(401);//va rifatto
    }
    else {
        //VA SETTATO PROB LO STATO DI ERRORE.
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            let source = await user.findOne({ email: email });
            const password = req.body.oldPassword;
            const buff = Buffer.from(password, 'base64');

            const decodedpass = buff.toString('utf-8');
            if (await bcrypt.compare(decodedpass, source.password)) {
                //le due password coincidono, allora mando uno status 200
                res.status(200).send();
            } else {
                res.status(401).send();
            }
        });
    }
})

/**
 * Given a mail, returns ok if there is a user with that email associated, bad request otherwise.
 * @param {email, password}
 * @return {200, 401}
 */
router.post('/email-validation', async (req, res) => {
    const email = req.body.email;
    let source = await user.findOne({ email: email });
    if (!source) {
        //nessuno è stato trovato con la mail che stiamo per inserire.
        res.status(200).send();
    }
    else {
        res.status(400).send();
    }
});

/**
 * Given a field to updates, and the new value, updates that field.
 * @param {email | passw | name | surname | phone | ...}
 * @returns {200, 500}
 */
router.post('/update', async (req, res) => {
    //VANNO SETTATI PER BENE GLI STATI DI ERRORE.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            //devo handlare il fatto se c'è un errore.
            const email = decoded.email;
            // console.log(email);
            //diamo per scontato che lo user esista??
            //in questo caso si perchè prendiamo dal token, ma se uno lo modifica?
            // https://medium.com/swlh/hacking-json-web-tokens-jwts-9122efe91e4a

            let source = await user.findOne({ email: email });
            // console.log(source);

            //adesso dobbiamo in un qualche modo leggere quello che vogliamo cambiare, e cambiarlo
            const data = req.body;

            switch (data.type) {
                case 'name':
                    source.name = data.name;
                    break;
                case 'surname':
                    source.surname = data.surname;
                    break;
                case 'phone':
                    source.phone = data.phone;
                    break;
                case 'email':
                    source.email = data.email;
                    break;
                default:
                    //SIAMO NELLA PARTE DELLE PASSWORD
                    const password = req.body.newPassword;
                    const buff = Buffer.from(password, 'base64');
                    const decodedpass = buff.toString('utf-8');
                    const hash = await bcrypt.hash(decodedpass, 10, function (err, hash) {
                        source.password = hash;
                        source.save();
                        res.status(200).send();
                    });
                    break;
            }
            if (data.type !== 'password') {
                source.save();
                res.status(200).send();
            }
        });
    }
})

/**
 * Given an email associated with a user, returns his info(passw excluded)
 * @param {email}
 * @returns {info}
 */
router.post("/getInfo", async (req, res) => {
    //fare cose 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            let source = await user.findOne({ email: email });
            if (source) {
                let info = {
                    name: source.name,
                    surname: source.surname,
                    phone: source.phone,
                    email: source.email,
                    paymentMethod: source.paymentMethod,
                    futureReservations: source.futureReservations,
                    activeReservations: source.activeReservations,
                    pastReservations: source.pastReservations
                }
                res.json(JSON.stringify(info));
            }
            else {
                res.status(500).send();
            }
        });
    }
});

/**
 * Given an email associated with a user, deletes him from the DB
 * @param {email}
 * @returns {200, 401, 500}
 */
router.post('/deleteaccount', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            user.deleteOne({ email: email })
                .then(() => {
                    //sono riuscito ad eliminarlo
                    console.log("account removed");
                    res.status(200).send();
                })
                .catch((error) => {
                    //non sono riuscito ad eliminarlo
                    console.log(error);
                    res.status(500).send();
                })
        });
    }
});

/**
 * Given an email associated with a user, cleares his communications field.
 * @param {email}
 * @returns {200, 401}
 */
router.post("/clearcommunications", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            let usr = await user.findOne({ email: email });
            usr.communications = [];
            usr.save();
            res.status(200).send();
        })
    }
})
/**
 * Given an email associated with a user, a product name, dates and an operation,
 * operate on the reservation made by the user into the product scheme.
 * @param {email, name, start, end, operation}
 * @returns {200, 400, 401}
 */
router.post("/modifypreparation", async (req, res) => {
    //QUI SERVE LA MAIL
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const prodName = req.body.prodName;
            let prod = await product.findOne({ name: prodName });
            if (prod) {
                if (req.body.operation === 'remove') {
                    //devo togliere da array la reservation
                    let index = -1;
                    let start = new Date(req.body.start);
                    // console.log("siamo nella remove" + start);
                    for (let i in prod.reservations) {
                        // console.log("siamo nella remove" + prod.reservations[i].start);
                        //faccio req.body.start perchè è già una data vera e propria
                        if (prod.reservations[i].start.getTime() === start.getTime()) {
                            index = i;
                            break;
                        }
                    }
                    // console.log('siamo nella remove temporanea con index:' + index);
                    prod.reservations.splice(index, 1);
                    prod.save();
                    // console.log("rimosso");
                }
                else if (req.body.operation === 'create') {
                    let reservation = {
                        usermail: decoded.email,
                        start: req.body.start,
                        end: req.body.end
                    };
                    //devo pushare nell'array la reservation.
                    prod.reservations.push(reservation);
                    prod.save();
                    // console.log("creato");
                }
                res.status(200).send();
            }
            else {
                res.status(400).send();
            }
        });
    }
})

/**
 * Given an email a reservation associated with a user, a product and a reservation, removes the reservation
 * from the user schema and from the product schema
 * @param {email, startingDate, prodName}
 * @returns {200, 401}
 */
router.post("/removeReservation", async (req, res) => {
    // console.log("siamo qua");
    //devo avere la starting date, ending date, name product e anche il token.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            //eliminiamo la prenotazione dallo user.
            //trovo il modo di identificare il mio user.
            const email = decoded.email;
            let source = await user.findOne({ email: email });
            let index = -1;
            let startingDate = new Date(req.body.startingDate);
            //creo una prenotazione come quelle che abbiamo nel db
            for (let i in source.futureReservations) {
                if (source.futureReservations[i].start.getTime() === startingDate.getTime()) {
                    index = i;
                    break;
                }
            }
            //elimino elemento in determinato indice.
            // console.log("indice dei user è: " + index);
            source.futureReservations.splice(index, 1);
            source.save();
            //adesso eliminiamo la prenotazione vecchia dal prodotto.

            let prod = await product.findOne({ name: req.body.prodName });
            //trovo indice all'interno dell'array delle reservations.
            for (let i in prod.reservations) {
                if (prod.reservations[i].start.getTime() === startingDate.getTime()) {
                    index = i;
                    break;
                }
            }
            // console.log("indice dei prodotti è: " + index);
            //elimino elemento in determinato indice.
            prod.reservations.splice(index, 1);
            prod.save();
            res.status(200).send();
        });
    }
});


//------------------------------------------------------------------------
//API FATTE IN MODO REST
/**
 * Verify if the manager exists in the database. If yes, the manager receive a token
 * @param {email, password}
 * @return {token}
 */
router.get('/user', async (req, res) => {
    //trovo tutti gli user del sistema
    let users = await user.find();
    if (users) {
        users = users.filter(user => user.email !== 'defaultUser@nolonolo.com');
        res.status(200).json({ users: users });
    }
    else {
        //non ci sono utenti 
        res.status(500).send("no active users");
    }
});
//RICORDARSI CHE POI BISOGNA FARE PIÙ LAVORO CLIENT SIDE

//METTO ANCHE QUI QUELLA DELL'EMPLOYEE
router.get('/employee', async (req, res) => {
    //trovo tutti gli user del sistema
    let employees = await employee.find();
    if (employees) {
        res.status(200).json({ employees: employees });
    }
    else {
        //non ci sono dipendenti 
        res.status(500).send("no employees");
    }
});

router.get('/category', async (req, res) => {
    let cat = await category.find();
    if (cat) {
        res.status(200).json({ category: cat });
    } else {
        res.status(500).send();
    }
});

router.get('/product', async (req, res) => {
    let prod = await product.find();
    if (prod) {
        res.status(200).json({ products: prod });
    } else {
        res.status(500).send();
    }
});



module.exports = router;