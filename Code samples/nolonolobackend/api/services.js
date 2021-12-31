
// const category = require('../schemas/moduleCategory');
// const product = require('../schemas/moduleProduct');
// const computePrice = require('../functions/computePrice');
// const jwt = require('jsonwebtoken');

// const express = require('express');
// const checkAvailability = require('../functions/checkAvailability');
// const router = express.Router();

// router.post('/products', async (req, res) => {
//     let prodList = [];
//     //questo ci aiuta ad iterare su tutti gli elementi della collezione
//     for await (const doc of category.find()) {
//         prodList.push(doc);
//     }
//     res.status(200).json({ prodList: prodList });
// })

// /**
//  * from the name of a product, return his category
//  * @param {prodName}
//  * @return {category}
//  */
// router.post('/getCategory', async (req, res) => {
//     let prodName = req.body.prodName;
//     const prod = await product.findOne({ name: prodName });
//     if (prod) {
//         //se prod non è nullo.
//         //qui prendere anche il testo sarebbe top.
//         let category = {
//             category: prod.type
//         }
//         res.json(JSON.stringify(category));
//     }
// });


// router.post('/formProducts', async (req, res) => {
//     const authHeader = req.headers['authorization'];
//     let token;
//     if (authHeader != null) {
//         token = authHeader && authHeader.split(' ')[1];

//         const name = req.body.name;
//         let startDate = new Date(req.body.startingDate);
//         startDate.setDate(startDate.getDate() + 1);
//         let endDate = new Date(req.body.endingDate);
//         endDate.setDate(endDate.getDate() + 1);

//         if (startDate.getTime() > endDate.getTime()) {
//             let tmp = startDate;
//             startDate = endDate;
//             endDate = tmp;
//         }
//         if (token != null) //  Siamo loggati 
//         {
//             jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
//                 if (err)
//                     console.log(err);

//                 //PRENDO LA CATEGORIA DELL'OGGETTO
//                 const collection = await category.findOne({ name: name });
//                 //il nome della categoria è il tipo dei prodotti
//                 let typeToFind = collection.name;
//                 if (collection) {
//                     let price;
//                     //ANDIAMO A VEDERE SUI SINGOLI PRODOTTI SE C'È DISPONIBILITÀ
//                     let available;
//                     let currentProd;
//                     let availableProductList = [];
//                     let prices = [];
//                     product.find({ type: typeToFind }, async function (err, db) {

//                         if (err) return (res.status(500).send(err));

//                         for (i in db) {
//                             if (checkAvailability.checkAvailability(db[i], startDate, endDate)) {
//                                 //dobbiamo fare in modo che sia il + economico
//                                 //productList è un array di elementi disponibili in una determinata data
//                                 availableProductList.push(db[i]);
//                                 //aggiungo il prezzo finale di questo prodotto nell'array
//                                 // prices.push(computePrice(db[i]))
//                                 prices.push(await computePrice.computePrice(collection, db[i], decoded.email, startDate, endDate));
//                             }

//                         }
//                         //calcolo il  prodotto più economico
//                         if (availableProductList.length != 0) {
//                             price = Math.min(...prices);
//                             //le posizioni sono le stesse
//                             currentProd = availableProductList[prices.indexOf(price.toString())];
//                             res.status(200).json({ prod: collection, finalPrice: price, availability: available, currProdName: currentProd.name });
//                         } else {
//                             res.status(200).json({ availability: false });
//                         }
//                     })
//                 }
//             })
//         } else { // l'utente non è loggato quindi calcoliamo la media del prezzo 

//             const prod = await category.findOne({ name: name });

//             if (prod) {
//                 //TO-DO capire il checkout ed il prezzo
//                 let price = prod.price;
//                 let period = endDate.getTime() - startDate.getTime();
//                 period = period / (1000 * 3600 * 24);
//                 price = price * period;

//                 return (res.status(200).json({ prod: prod, finalPrice: price }));
//             }
//         }
//     }
// });

// module.exports = router;