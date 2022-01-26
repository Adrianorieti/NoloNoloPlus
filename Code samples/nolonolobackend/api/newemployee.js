const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee');
const pending = require('../schemas/modulePendingRequest');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');
const path = require('path');
const computePrice = require('../functions/computePrice');
const emailChange = require('../functions/emailCascade');
const sortBy = require('../functions/sortBy');
const express = require('express');
const bcrypt = require('bcrypt');
const checkAvailability = require('../functions/checkAvailability');
const router = express.Router();
const reservations = require('../functions/reservationsHelper');

router.get('/', async (req, res) => {
    //trovo tutti gli user del sistema
    let employees = await employee.find({});
    if (employees) {
        res.status(200).json({ emp: employees });
    }
    else {
        //non ci sono utenti 
        res.status(500).send("no active employee");
    }
})

router.get('/:email', async (req, res) => {
    let email = req.params.email;
    employee.findOne({ email: email })
        .exec()
        .then((result) => {
            res.status(200).json({ emp: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "internal server error" });
        })
})

module.exports = router;