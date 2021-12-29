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
            res.status(500).json({ message: 'Internal error', error: err })
        })
})

/** Get a single product by name */
router.get('/:name', (req, res) => {
   let name = req.query.name;
   console.log(name);
    product.find({name: name})
        .exec()
        .then((doc) => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ message: 'Internal error', error: err })
        })
})

/** Verify if the product is available on a given period */
router.get('/:name/available', async (req, res) => {
  let name = req.params.name; 
  let start = new Date(req.query.start);
  let end = new Date(req.query.end);
  let email = req.email;
      product.find({name: name})
      .exec()
      .then(async (prod) => {
            let collection = await category.findOne({name: prod.type})
                if(checkAvailability.checkAvailability(prod, start, end)) {
                  let price = await computePrice.computePrice(collection, prod, email, start, end);
                  res.status(200).json({price: price, product: prod});
                }
        }).catch((err) => {
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
        activeReservation: [],
        pastReservations: [],
        numberOfRents: 0
    })
    newProduct
        .save()
        .then((result) => {
            res.status(200).json({
                message: 'Item created',
                product: newProduct,
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
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log("nope");
        res.status(400).json({ message: 'Bad input parameter', error: err })
    })
})

 /** Deletes a product if exists and return the list of future reservations */
router.delete('/:name', (req, res) => {
    let name = req.params.name;
    console.log(name);
    product.exists({name: name}, function (err, doc) {
        if (err){
            res.status(404).json({message: "Product not found", error: err})
        }else{
                product.findOneAndDelete({ name: name })
                        .exec()
                        .then((result) => {
                            console.log(result)
                            res.status(200).json({ message: 'Product deleted', reservations: result.futureReservations})
                })
           
    }
    });
})

module.exports = router;