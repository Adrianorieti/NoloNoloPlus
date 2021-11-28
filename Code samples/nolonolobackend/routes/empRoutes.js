const path = require('path');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const url = require('url');
const jwt = require('jsonwebtoken');
const employee = require('../schemas/moduleEmployee');
const auth = require('../api/auth');

router.get('/login', (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'login.html'));
});

router.get('/panel',auth.verifyAdmin, (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'panel.html'));
});




module.exports = router;