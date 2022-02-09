const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee'); //questo serve per fare le statistiche sugli impiegati.
const manager = require('../schemas/moduleManager');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');
const emailChange = require('../functions/emailCascade');
const auth = require('./auth');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

const employeeImagesPath = path.join(
    global.rootDir,
    '/images/employees'
)

// Initialize local storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, employeeImagesPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    },
})

function deleteImg(img) {
    if (img) {
        try {// controllare se non c'è default dentro il nome dell'immagine
            fs.unlinkSync(path.join(employeeImagesPath, path.basename(img)))
        } catch (err) {
            console.log('Error while removing image')
            console.log({ error: err })
        }
    }
}

const upload = multer({ storage: storage })

/** Get all managers in database */
router.get('/', (req, res) => {

    manager.find({}, function (err, docs) {
        if (err)
            res.status(500).json({ message: 'Internal error', error: err })
        else {
            res.status(200).json(docs);
        }
    })
})

router.patch('/:email', upload.single('img'), async (req, res) => {
    let email = req.params.email;
    let newData = {};
    newData.name = req.body.name;
    newData.surname = req.body.surname;
    newData.phone = req.body.phone;
    if (req.body.password) {
        await bcrypt.hash(req.body.password, 10, function (err, hash) {
            newData.password = hash;
        });
    }
    if (req.file) {
        newData.image = req.file.filename;
        if (req.body.oldImg) {
            deleteImg(req.body.oldImg);
        }
    }
    manager.findOneAndUpdate(
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

router.post('/:email', upload.single('img'), async (req, res) => {
    const email = req.params.email;
    const source = await employee.findOne({ email: email });
    if (!source) {
        //is null
        const password = req.body.password;
        const hash = await bcrypt.hash(password, 10, function (err, hash) {

            const newManager = new manager({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: email,
                password: hash,
                role: "manager",
                image: req.file.filename
            });
            const newEmployee = new employee({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: email,
                password: hash,
                paymentMethod: req.body.paymentMethod,
                image: req.file.filename,
                role: 'admin',
                totalReservations: 0,
                futureReservations: [],
                activeReservations: [],
                pastReservations: []
            });
            newEmployee
                .save()
                .then((result) => {
                    newManager
                        .save()
                        .then((resultt) => {
                            res.status(200).json({
                                message: 'Employee created'
                            })
                        })
                })
                .catch((err) => {
                    res.status(400).json({ message: 'Bad input parameter', error: err })
                })

        })
    } else {
        res.status(500).json({ message: 'Mail already exists' });
    }
})

module.exports = router;
