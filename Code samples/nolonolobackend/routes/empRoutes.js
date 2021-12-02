const path = require('path');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const auth = require('../api/auth');

router.get('/login', (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'login.html'));
});

router.get('/panel',auth.verifyAdmin, (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'panel.html'));
});

router.get('/rentalHypothesis', (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'rentalHypothesis.html'));
});



module.exports = router;