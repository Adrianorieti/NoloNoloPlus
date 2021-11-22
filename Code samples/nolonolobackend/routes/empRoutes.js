const path = require('path');
const express = require('express');
const router = express.Router();
require('dotenv').config();


router.get('/login', (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'login.html'));
});





module.exports = router;