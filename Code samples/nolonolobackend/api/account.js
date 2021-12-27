const user = require('../schemas/moduleUser');
const manager = require('../schemas/moduleManager');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const express = require('express');

const router = express.Router();

/**
 *  Verify if the user exists in the database. If yes, the user receives a token
 * @param {email, password}
 * @return {token}
 */
// router.post('/login', async (req, res) => {
//     const mail = req.body.email;

//     //We check if user exists in database
//     const source = await user.findOne({ email: mail });

//     if (source) {

//         const password = req.body.password;

//         const buff = Buffer.from(password, 'base64');

//         const decodedpass = buff.toString('utf-8');

//         // If user exists we compare the password
//         if (await bcrypt.compare(decodedpass, source.password)) {

//             console.log("Success");

//             //CREATE  JWT
//             const user = { email: `${source.email}` };
//             const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, { expiresIn: '1h' });

//             //Send token back to client 
//             res.json({ accessToken: accessToken, name: `${source.name}` });

//         } else {
//             console.log("Password doesn't match");
//         }
//     } else {
//         console.log('Errore la mail non esiste');
//         res.status(500).send({ error: 'Mail not exists' });
//     }

// });

/**
 * Create a new user inside the database.
 * @param {name, surname, email, password, phone, paymentMethod}
 */
router.post('/register', async (req, res) => {

    const mail = req.body.email;

    const source = await user.findOne({ email: mail });
    console.log(source);

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
                paymentMethod: 'Paypal',
                role: 'customer',
                fidelityPoints: 5,
                amountPaid: 0
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


/**
 * Verify if the person with a certain role exists in the database. If yes,receives a token back
 * @param {email, password}
 * @return {token}
 */
router.post('/login/:role', async (req, res) => {

    const email = req.body.email;
    const role = req.params.role;
    let source;
    if (role === 'manager') {
        source = await manager.findOne({ email: email });
    }
    else if (role === 'admin') {
        source = await employee.findOne({ email: email });
    }
    else {
        source = await user.findOne({ email: email });
    }

    if (source)  // L'account richiesto è stato trovato
    {
        const password = req.body.password;

        const buff = Buffer.from(password, 'base64');

        const decodedpass = buff.toString('utf-8');

        // We compare the passwords
        if (await bcrypt.compare(decodedpass, source.password)) {

            if (role != 'manager') {
                //CREATE  JWT
                const user = { email: `${source.email}` };
                const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, { expiresIn: '1h' });

                //Send token back to client 
                res.json({ accessToken: accessToken, name: `${source.name}` });
            }
            else {
                // Create the json web token
                //const manager = { email: `${source.email}` };
                //const accessToken = jwt.sign(manager, process.env.TOKEN_EMPLOYEE_KEY, { expiresIn: '9h' });//LINEA DA CAMBIARE

                //Send token back to client 
                console.log("Success");
                //res.status(200).json({ accessToken: accessToken });
                res.status(200).send();
            }

        } else {
            res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
            console.log("Password doesn't match");
        }
    } else {
        res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
    }
});



module.exports = router;