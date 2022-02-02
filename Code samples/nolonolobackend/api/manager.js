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

const upload = multer({ storage: storage })

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
