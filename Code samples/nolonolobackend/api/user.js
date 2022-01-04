const jwt = require('jsonwebtoken');
require('dotenv').config();
const user = require('../schemas/moduleUser');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const employee = require('../schemas/moduleEmployee');
const express = require('express');

const router = express.Router();

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

router.patch('/:email', (req, res) => {
    let email = req.params.email;
    let newData = req.body;
    console.log("email: ", email);
    console.log("newdata: ", newData);
    user.findOneAndUpdate(
        { email: email },
        { $set: newData },
        { runValidators: true, new: false, useFindAndModify: false }
    ).exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
})

module.exports = router;