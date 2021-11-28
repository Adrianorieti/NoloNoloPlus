const path = require('path');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const url = require('url');
const jwt = require('jsonwebtoken');
const employee = require('../schemas/moduleEmployee');

function verifyAdmin(req, res, next)
    {   
        /* We retrieve the full url of the request so we can extract the parameters */
        const current_url = new URL(`http://${req.get('host')}` + req.originalUrl);
        const search_params = current_url.searchParams;
        const token = search_params.get('token');
        if(token == null) return res.sendStatus(401);
        else if(token)
        {
            jwt.verify(token, process.env.TOKEN_EMPLOYEE_KEY, async function(err, decoded)
        {
           console.log('sono dentro');
           if(err) 
           {
               console.log(err.name);
               return res.status(403).send(` ${err.name} `);
           }
           const source =  await employee.findOne({ email: decoded.email });
           console.log(source);
           if(source.role !== 'admin')
           {
               return res.status(403).send(` Only an admin can access this page`);
           }
           next();
       })
        }
       
    }

router.get('/login', (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'login.html'));
});

router.get('/panel',verifyAdmin, (req, res) => {
    res.sendFile(path.join(process.env.ABSOLUTE_PATH, '/html', 'panel.html'));
});




module.exports = router;