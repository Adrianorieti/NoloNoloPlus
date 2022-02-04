const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const user = require('../schemas/moduleUser');
const path = require('path');
const manager = require('../schemas/moduleManager');
const employee = require('../schemas/moduleEmployee');

function verifyToken(req, res, next) {
    //retrieve the token from request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token != 'null') {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            if (err) {
                return res.status(403).send(` ${err.name} `);
            }
            req.email = decoded.email;
            next();
        })
    } else {
        req.email = 'defaultUser@nolonolo.com';
        next();
    }
}
function verTok(req, res, next) {
    //retrieve the token from request header
    const token = req.params.token;
    if (token) {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            if (err) {
                return res.status(403).json({ message: err.name });
            }
            req.email = decoded.email;
            next();
        })
    } else {
        return res.status(403).json({ message: 'null token' });
    }
}

router.get('/:token', (req, res) => {
    let token = req.params.token;
    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
        if (err) {
            res.status(500).json({ message: "Not valid token" });
        }
        else {
            res.status(200).json({ email: decoded.email });
        }
    });
})

router.get('/:role/:token', verTok, async (req, res) => {
    let role = req.params.role;
    const email = req.email;
    let source;
    //we control that the email is in the role schema
    switch (role) {
        case 'admin':
            source = await employee.findOne({ email: email });
            break;
        case 'manager':
            source = await manager.findOne({ email: email });
            break;
        default:
            //non penso la useremo mai qui
            source = await user.findOne({ email: email });
            break;
    }
    if (!source) {
        //is null 
        res.status(403).json({ message: 'only a ' + role + 'can access this page' });
    }
    else {
        res.status(200).json({ message: 'access' });
    }
})

router.get('/', verifyToken, (req, res) => {
    if (req.email !== 'defaultUser@nolonolo.com') {
        res.status(200).send();
    }
    else {
        res.status(500).send();
    }
})


function verifyAdmin(req, res, next) {
    /* We retrieve the full url of the request so we can extract the parameters */
    const current_url = new URL(`http://${req.get('host')}` + req.originalUrl);
    const search_params = current_url.searchParams;
    const token = search_params.get('token');
    if (token === 'null') return res.sendStatus(401);
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            if (err) {
                console.log(err.name);
                return res.status(403).send(` ${err.name} `);
            }
            const source = await employee.findOne({ email: decoded.email });
            if (source.role !== 'admin') {
                return res.status(403).send(` Only an admin can access this page`);
            }
            req.emp = source;
            next();
        })
    }
}

module.exports = router
module.exports.verifyToken = verifyToken
module.exports.verifyAdmin = verifyAdmin