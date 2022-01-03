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

module.exports = router;