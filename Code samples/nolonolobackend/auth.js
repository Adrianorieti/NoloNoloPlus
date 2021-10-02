//Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('./moduleUser');


module.exports = {
    //Verify identity of user requesting url
verifyToken: function(req, res, next)
{
    //retrieve the token from request header
   const authHeader = req.headers['authorization'];

   const token = authHeader && authHeader.split(' ')[1];
   console.log(token);
   
   if(token == null) return res.sendStatus(401);

   jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
   {
       console.log("sono qui");
       console.log("nome utente " + decoded.name);

       if(err) 
       {
           console.log(err.name);
           return res.status(403).send(` ${err.name} `);
       }

      
   
       next();
   })
},
    verifyAdmin: function(req, res, next)
    {
       const authHeader = req.headers['authorization'];
       console.log(authHeader);
       const token = authHeader && authHeader.split(' ')[1];
       console.log(token);
       if(token == null) return res.sendStatus(401);
       jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
       {
           if(err) 
           {
               console.log(err.name);
               return res.status(403).send(` ${err.name} `);
           }
   
           console.log(decoded.name);
   
           const source =  await user.findOne({ name: decoded.name });
           console.log(source);
           if(source.role !== 'admin')
           {
               return res.status(403).send(` Only an admin can access this page`);
   
           }
   
       
           next();
       })
    }
  };


