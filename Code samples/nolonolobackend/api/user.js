const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const user = require('../schemas/moduleUser');
const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const changeEmail = require('../functions/emailCascade');

const userImagesPath = path.join(
    global.rootDir,
    '/images/users'
)

// Initialize local storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImagesPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    },
})

function deleteImg(img) {
    if (img) {
        try {// controllare se non c'è default dentro il nome dell'immagine
            fs.unlinkSync(path.join(userImagesPath, path.basename(img)))
        } catch (err) {
            console.log('Error while removing image')
            console.log({ error: err })
        }
    }
}

const upload = multer({ storage: storage })

const router = express.Router();

router.get('/', async (req, res) => {
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

router.get('/:email', (req, res) => {
    let email = req.params.email;
    user.findOne({ email: email })
        .exec()
        .then((result) => {
            res.status(200).json({ user: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "internal server error" });
        })
})


router.post('/:email', async (req, res) => {
    const email = req.params.email;
    const source = await user.findOne({ email: email });

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
                email: email,
                password: hash,
                image: "default.jpeg",
                paymentMethod: req.body.paymentMethod,
                role: 'customer',
                fidelityPoints: 5,
                amountPaid: 0,
                communications: [],
                futureReservations: [],
                activeReservations: [],
                pastReservations: []
            });
            //user is saved in mongodb
            newUser.save();
            res.status(200).json({ message: "success" });

        })
    } else {
        res.status(500).json({ message: 'Mail already exists' });
    }
});

router.patch('/:email', upload.single('img'), async (req, res) => {
    let email = req.params.email;
    let newData = {};
    if (!req.file) {
        newData = req.body;
        if (newData.password) {
            await bcrypt.hash(newData.password, 10, function (err, hash) {
                newData.password = hash;
            });
        }
        else if (newData.email) {
            changeEmail.emailCascadeChange(newData.email, email);
        }
    } else {
        newData.image = req.file.filename;
    }
    user.findOneAndUpdate(
        { email: email },
        { $set: newData },
        { runValidators: true, new: false, useFindAndModify: false }
    ).exec()
        .then((result) => {
            res.status(200).json({ message: "Comunication Succesfuly added" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
})

router.delete('/:email', async (req, res) => {
    let email = req.params.email;
    console.log(email);
    user.exists({ email: email }, async function (err, doc) {
        if (err) {
            res.status(404).json({ message: "User not found", error: err })
        } else {
            let usr = await user.findOne({ email: email });
            console.log(usr);
            if (usr.activeReservations.length != 0 || usr.futureReservations.length != 0) {
                res.status(500).json({ message: "Impossible, there are future or active reservations" })
            } else {

                user.findOneAndDelete({ email: email })
                    .exec()
                    .then((result) => {
                        console.log(result)
                        res.status(200).json({ message: 'User deleted' })
                    })
            }

        }
    })
})

module.exports = router;