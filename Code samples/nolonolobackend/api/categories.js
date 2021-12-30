const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const auth = require('./auth');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');
const router = express.Router();

/** Get all categories in database */
router.get('/', (req, res) => {
   
    category.find({}, function(err, docs){
        if(err)
            res.status(500).json({ message: 'Internal error', error: err })
        else
        {
            res.status(200).json(docs);
        }
    })
})

/** Get a single category by name */
router.get('/:name', (req, res) => {
   let name = req.params.name;
    category.find({name: name})
        .exec()
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ message: 'Internal error', error: err })
        })
})

/** Verify if a category has at least an available product and return the less expensive */
router.get('/:name/available', auth.verifyToken, async (req, res) => {
  let name = req.params.name; 
  let start = new Date(req.query.start);
  start.setDate(start.getDate() +1);
  let end = new Date(req.query.end);
  end.setDate(end.getDate() +1);
  let email = req.email;
  // pensare di spostare il segno sui prodotti per non dover fare questa call al database
  let collection = await category.findOne({name: name})
  if(collection)
    {
        product.find({type: name})
        .exec()
        .then(async (products) => {
            let availableProducts = [];
            let prices = [];
            for (let i in products) {
                if (checkAvailability.checkAvailability(products[i], start, end)) {
                    availableProducts.push(products[i]);
                    let x = await computePrice.computePrice(collection, products[i], email, start, end);
                    console.log(typeof x);
                    prices.push(x);
                }
            }
            if(availableProducts.length > 0) {
                
                let price = Math.min(...prices);
                console.log(price);
                let index = prices.indexOf(price);
                console.log(index);
                // let winner = availableProducts[index]; //le posizioni sono le stesse 
                // devo comunque ritornare la categoria secondo i dettami del prof
                res.status(200).json({finalPrice: price, category: collection});
            } else {
                res.status(500).json({message: "No products available for those dates"});
            }      
        })
    }else
    {
        res.status(404).json({message: 'Category not found'});
    }
})

/** Add a category */
router.post('/', (req, res) => {
    const newCategory = new category({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        discountCode: req.body.discountCode
    })
    newCategory
        .save()
        .then((result) => {
            res.status(200).json({
                message: 'Category created',
                product: newCategory,
            })
        })
        .catch((err) => {
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
})
/** Modify a category with the given name */
router.patch('/:name', (req, res) => {
    let name = req.params.name;
    let newData = req.body.newData;

    category.findOneAndUpdate(
        { name: name },
        { $set: newData },
        { runValidators: true, new: false, useFindAndModify: false }
    ).exec()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(400).json({ message: 'Bad input parameter', error: err })
    })
})

 /** Deletes a category if exists and also all products of that category*/
router.delete('/:name', (req, res) => {
    let name = req.params.name;
    category.exists({name:name}, function (err, doc) {
        if (err){
            res.status(404).json({message: "Category not found", error: err})
        }else{
            category.findOneAndDelete({ name: name })
                    .exec()
                    .then((result) => {
                        product.deleteMany({type: name}).exec()
                        .then(function(){
                            res.status(200).json({ message: 'Category deleted',})
                        }).catch(error => {
                            res.status(500).json({ message: 'Internal error',})
                        })
        }).catch(error => {
            res.status(500).json({ message: 'Internal error',})
        })
    }
    });
})

module.exports = router;