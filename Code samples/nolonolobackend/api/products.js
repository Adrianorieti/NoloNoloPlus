const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const auth = require('./auth');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const router = express.Router();

/** Get all products in database */
router.get('/', (req, res) => {
   
     product.find({})
        .exec()
        .then((products) => {
            res.status(200).json({productList: products});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal error'})
        })
})

/** Get a single product by name */
router.get('/:name', (req, res) => {
   let name = req.query.name;
   console.log(name);
    product.find({name: name})
        .exec()
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ message: 'Internal error', error: err })
        })
})

/** Verify if the product is available on a given period */
router.get('/:name/available', (req, res) => {
    let name = req.params.name; 
    let start = new Date(req.query.start);
    start.setDate(start.getDate() +1);
    let end = new Date(req.query.end);
    end.setDate(end.getDate() +1);
    let email = req.query.email;
   
       product.findOne({name: name})
      .exec()
      .then(async (prod) => {
          console.log("sono dentro");
            let collection = await category.findOne({name: prod.type})
                if(checkAvailability.checkAvailability(prod, start, end)) {
                  let price = await computePrice.computePrice(collection, prod, email,'', start, end);
                  res.status(200).json({price: price, product: prod});
                }else
                {
                    res.status(400).json({ message: 'Not available', product: prod })
                }
        }).catch((err) => {
            console.log(err);       
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
    
})
/** Add a product */
router.post('/', (req, res) => {

    const newProduct = new product({
        name: req.body.name,
        type: req.body.type,
        status: 'new',
        price: req.body.price,
        futureReservations: [],
        activeReservation: {},
        pastReservations: [],
        totalSales: 0,
        numberOfRents: 0
    })

    newProduct
        .save()
        .then(() => {
            console.log("ok");
            res.status(200).json({
                message: 'Item created'
            })
        })
        .catch((err) => {
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
})
/** Modify a product with the given name */
router.post('/:name', (req, res) => {
    let name = req.params.name;
    let newData = req.body; // deve essere un json {key: value}
    product.findOneAndUpdate(
        { name: name },
        { $set: newData },
        { runValidators: true, new: false, useFindAndModify: false }
    ).exec()
    .then((result) => {
        console.log(result);
        res.status(200).json({message: "Succesfuly changed"});
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({ message: 'Bad input parameter'})
    })
})

 /** Deletes a product if exists and if there are no future reservations */
router.delete('/:name', async (req, res) => {
    let name = req.params.name;
    console.log(name);
    product.exists({name: name}, async function (err, doc) {
        if (err){
            res.status(404).json({message: "Product not found", error: err})
        }else{
            console.log(doc);
            let prod = await product.findOne({name: name});
            console.log(prod);
            if(prod.futureReservations.length != 0)
            {
                res.status(500).json({message: "Impossible, there are future reservations on the product"});
            }else
            {

                product.findOneAndDelete({ name: name })
                .exec()
                .then((result) => {
                    res.status(200).json({ message: 'Product deleted'})
                })
                
            }
            }
    });
})

module.exports = router;