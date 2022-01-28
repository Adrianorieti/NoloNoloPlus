const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const auth = require('./auth');
const multer = require('multer');
const path = require('path');
const express = require('express');
const checkAvailability = require('../functions/checkAvailability');


const categoriesImagesPath = path.join(
    global.rootDir,
    '/images/categories'
)

// Initialize local storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, categoriesImagesPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    },
})

const upload = multer({ storage: storage })
const router = express.Router();

/** Get all categories in database */
router.get('/', (req, res) => {

    category.find({}, function (err, docs) {
        if (err)
            res.status(500).json({ message: 'Internal error', error: err })
        else {
            console.log(docs);
            res.status(200).json({ categories: docs });
        }
    })
})

/** Get a single category by name */
router.get('/:name', (req, res) => {
    let name = req.params.name;
    category.find({ name: name })
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
    start.setDate(start.getDate() + 1);
    let end = new Date(req.query.end);
    end.setDate(end.getDate() + 1);
    let email = req.email;
    // pensare di spostare il segno sui prodotti per non dover fare questa call al database
    let collection = await category.findOne({ name: name })
    if (collection) {
        console.log(name);
        product.find({ type: name })
            .exec()
            .then(async (products) => {
                let availableProducts = [];
                let availPrices = [];
                let prices = [];
                let available;
                let availPrice = 0;
                let price = 0;
                let winner;
                for (let i in products) {
                    let x = await computePrice.computePrice(collection, products[i], email, '', start, end);
                    if (checkAvailability.checkAvailability(products[i], start, end)) {
                        availableProducts.push(products[i]);
                        availPrices.push(x)
                    }
                    prices.push(x);
                }
                price = Math.min(...prices); // calcolo comunque il prezzo minore
                if (availableProducts.length > 0) { // abbiamo prodotti disponibili
                    availPrice = Math.min(...availPrices);
                    available = true;
                    let index = availPrices.indexOf(availPrice)
                    winner = availableProducts[index]; //le posizioni sono le stesse 
                    // devo comunque ritornare la categoria secondo i dettami del prof
                } else { // non abbiamo prodotti disponibili
                    available = false;
                }
                res.status(200).json({ hypothesisPrice: price, category: collection, available: available, product: winner, availPrice: availPrice });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: 'Internal error', error: err })
            })
    } else {
        res.status(404).json({ message: 'Category not found' });
    }
})

/** Add a category 
 * firstly we save the new image into the filesystem
 * the new image is required.
*/
router.post('/', upload.single('img'), (req, res) => {
    const newCategory = new category({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        discountCode: req.body.discountCode,
        imageName: req.file.filename
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
router.patch('/:name', upload.single('img'), (req, res) => {
    let name = req.params.name;
    let newData = {};
    if (!req.file) {
        newData = req.body.newData;
    }
    else {
        newData.imageName = req.file.filename;
    }
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
    category.exists({ name: name }, function (err, doc) {
        if (err) {
            res.status(404).json({ message: "Category not found", error: err })
        } else {
            category.findOneAndDelete({ name: name })
                .exec()
                .then((result) => {
                    product.deleteMany({ type: name }).exec()
                        .then(function () {
                            res.status(200).json({ message: 'Category deleted', })
                        }).catch(error => {
                            res.status(500).json({ message: 'Internal error', })
                        })
                }).catch(error => {
                    res.status(500).json({ message: 'Internal error', })
                })
        }
    });
})

module.exports = router;