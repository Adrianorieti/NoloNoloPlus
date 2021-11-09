const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');

const computePrice = require('../functions/computePrice');
const auth = require('./auth');
const express = require('express');


const router = express.Router();


/**
 * Verify if the employee exists in the databse. If yes, the employee receive a token
 * @param null
 */
router.post('/login', async (req, res) => {

    const email = req.body.email;

    const source = await employee.findOne({ email: email });
   
    if(source)  // L'account richiesto è stato trovato
    {
        const password = req.body.password;

        const buff = Buffer.from(password, 'base64');

        const decodedpass = buff.toString('utf-8');

        // We compare the passwords
        if (await bcrypt.compare(decodedpass, source.password)) {

            console.log("Success");

            // Create the json web token
            const employee = { email: `${source.email}` };
            const accessToken = jwt.sign(employee, process.env.TOKEN_EMPLOYEE_KEY, { expiresIn: '9h' });

            //Send token back to client 
            res.json({ accessToken: accessToken});

        } else {
            res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
            console.log("Password doesn't match");
        }
    }else{
        res.status(404).send('Error, the requested account may not exists or your credentials are not correct');
    }
});

/**
 * Gets all the products from the database. Token is checked in order to verify the role.
 * @param jsonwebtoken
 * @return { list of all single products}
 */
router.get('/products', auth.verifyAdmin ,async (req, res) => {

    const products = await product.find();
    if(products)
    {
        res.status(200).json({productList: products});
    }else{
        res.status(500).send("Error with database");
    }
});

/**
 * Make a rental hypothesis impersonating a user.
 * @param {jsonwebtoken, productName, categoryName, userMail, startDate, endDate}
 * @return {available product, computed price, image}
 * @error  Returns error if there is no available product for a given date
 */
router.post('/makeRentalHypothesis', auth.verifyAdmin, async (req,res) =>{

    const userMail = req.body.name;
    const name = req.body.name;
    let startDate = new Date(req.body.startingDate);
    startDate.setDate(startDate.getDate() + 1);
    let endDate = new Date(req.body.endingDate);
    endDate.setDate(endDate.getDate() + 1);

    if(startDate.getTime() > endDate.getTime())
    {
        let tmp = startDate;
        startDate = endDate;
        endDate = tmp;
    }
    const collection =  await category.findOne({name: name});
    let typeToFind = collection.name;
    if(collection)
    {
        let price ;
        let available = false;
        let currentProd;
        let availableProductList = [];
        let prices = [];
        product.find({type: typeToFind},  async function(err, db){
        if(err) return(res.status(500).send(err));

    for(i in db) 
    {
        available=true;
        for(j in db[i].reservations)
        {
            let x = db[i].reservations[j];
            if( startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime() )
            {
                available = false;
                break; 
            }else if( endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime())
            { 
                available = false;
                break;

            }else if( startDate.getTime() <= x.start.getTime()  &&  endDate.getTime() >=  x.end.getTime())
            {
                available = false;
                break;
            }
        }   
        if(available)
        {
            availableProductList.push(db[i]);
            prices.push(await computePrice.computePrice(collection, db[i], userMail, startDate, endDate));
        }
        }
        if(availableProductList.length != 0)
        {
            price = Math.min(...prices);
            currentProd = availableProductList[prices.indexOf(price)];
            res.status(200).json({prod: collection, finalPrice: price, availability: available, currProdName: currentProd.name});
        }else
        {
            res.status(200).json({ availability: false});
        } 
    })
}
});

/**
 * Get all users info from database.
 * @params null
 */
router.get('/getUsersInfo', auth.verifyAdmin, async (req, res) => {

    const usersList = await user.find();
    if(usersList)
    {
        res.status(200).json({users: usersList});
    }else
    {
        res.status(500).send("Database error");
    }
});

module.exports = router;