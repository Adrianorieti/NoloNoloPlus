const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const user = require('../schemas/moduleUser');
const path = require('path');
const employee = require('../schemas/moduleEmployee');

function verifyToken(req, res, next)
{
    //retrieve the token from request header
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   console.log("ARRIVOOO");
   console.log(token);
   if(token != 'null') 
   {
       jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
       {
           if(err) 
           {
               return res.status(403).send(` ${err.name} `);
           }
           req.email = decoded.email;
           next();
       })
   }else
   {
    req.email= 'defaultUser@nolonolo.com';
     next();
   }
}

function verifyAdmin(req, res, next)
    {   
        /* We retrieve the full url of the request so we can extract the parameters */
        const current_url = new URL(`http://${req.get('host')}` + req.originalUrl);
        const search_params = current_url.searchParams;
        const token = search_params.get('token');
        if(token === 'null') return res.sendStatus(401);
        else
        {
                jwt.verify(token, process.env.TOKEN_EMPLOYEE_KEY, async function(err, decoded)
                {
                    if(err) 
                    {
                        console.log(err.name);
                        return res.status(403).send(` ${err.name} `);
                    }
                    const source =  await employee.findOne({ email: decoded.email });
                    if(source.role !== 'admin')
                    {
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