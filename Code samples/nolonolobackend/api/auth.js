const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const user = require('../schemas/moduleUser');
const path = require('path');


function verifyToken(req, res, next)
{
    //retrieve the token from request header
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if(token == null) return res.sendStatus(401);

   jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
   {
       if(err) 
       {
           console.log(err.name);
           return res.status(403).send(` ${err.name} `);
       }
   
       next();
   })
}

function verifyAdmin(req, res, next)
    {
       const authHeader = req.headers['authorization'];
       const token = authHeader && authHeader.split(' ')[1];
       if(token == null) return res.sendStatus(401);
       jwt.verify(token, process.env.TOKEN_EMPLOYEE_KEY, async function(err, decoded)
       {
           if(err) 
           {
               console.log(err.name);
               return res.status(403).send(` ${err.name} `);
           }
      
           const source =  await user.findOne({ name: decoded.name });
           if(source.role !== 'admin')
           {
               return res.status(403).send(` Only an admin can access this page`);
           }
           next();
       })
    }

router.get("/authLog", verifyToken, (req, res) => {
    res.sendStatus(200);
});

router.get("/dashboard", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



module.exports = router
module.exports.verifyToken = verifyToken
module.exports.verifyAdmin = verifyAdmin