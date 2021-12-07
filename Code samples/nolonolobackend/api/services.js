const category = require('../schemas/moduleCategory');
const product = require('../schemas/moduleProduct');
const computePrice = require('../functions/computePrice');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

router.post('/products', async (req, res) => {
    let prodList = [];
    //questo ci aiuta ad iterare su tutti gli elementi della collezione
    for await (const doc of category.find()) {
        prodList.push(doc);
    }
    res.status(200).json({ prodList: prodList });
})

//from the name of the product, returns the category.
router.post('/getCategory', async (req, res) => {
    let prodName = req.body.prodName;
    const prod = await product.findOne({ name: prodName });
    if (prod) {
        //se prod non è nullo.
        //qui prendere anche il testo sarebbe top.
        let category = {
            category: prod.type
        }
        res.json(JSON.stringify(category));
    }
});


router.post('/formProducts', async (req, res) => {
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader != null) {
        token = authHeader && authHeader.split(' ')[1];
        console.log("Il token è", token);
    }

    const name = req.body.name;

    let startDate = new Date(req.body.startingDate);
    // startDate.setDate(startDate.getDate() + 1);
    let endDate = new Date(req.body.endingDate);
    // endDate.setDate(endDate.getDate() + 1);

    console.log("le date sono " + startDate + "\n" + endDate);

    if (startDate.getTime() > endDate.getTime()) {
        let tmp = startDate;
        startDate = endDate;
        endDate = tmp;
    }

    if (token != null) //  Siamo loggati 
    {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            console.log("email dell'utente", decoded.email);
            if (err)
                console.log(err);

            //PRENDO LA CATEGORIA DELL'OGGETTO
            const collection = await category.findOne({ name: name });
            if (collection) {
                //il nome della categoria è il tipo dei prodotti
                let typeToFind = collection.name;
                let price;
                let period = endDate.getTime() - startDate.getTime();
                //ANDIAMO A VEDERE SUI SINGOLI PRODOTTI SE C'È DISPONIBILITÀ
                let available = false;
                let currentProd;
                let availableProductList = [];
                let prices = [];
                product.find({ type: typeToFind }, async function (err, db) {
                    //BUG TROVATO NEL PREZZO, PERCHÈ PRENOTO MOUNTAIN X SE HO MOUNTAIN Z LIBERO? 

                    if (err) return (res.status(500).send(err));
                    console.log(db);
                    for (i in db) {
                        available = true;

                        for (j in db[i].reservations) {
                            let x = db[i].reservations[j];

                            // nei primi due if controlliamo che inizio o fine della prenotazione richiesta
                            //sia nel mezzo di un'altra, nell'ultimo se ne contiene un'altra già esistente
                            if (startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime()) {
                                console.log("l'inizio è compreso");
                                available = false;
                                break; // passo all'oggetto successivo non guardo tutte le altre reservation di quell'oggetto

                            } else if (endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime()) {
                                console.log("la fine  è compresa");

                                available = false;
                                break;

                            } else if (startDate.getTime() <= x.start.getTime() && endDate.getTime() >= x.end.getTime()) {
                                console.log("comprende tutto");
                                available = false;
                                break;
                            }

                        }

                        if (available) {
                            //IL PRODOTTO SINGOLO CORRENTE NON LA CATEGORIA
                            //dobbiamo fare in modo che sia il + economico
                            //productList è un array di elementi disponibili in una determinata data
                            availableProductList.push(db[i]);
                            //aggiungo il prezzo finale di questo prodotto nell'array
                            // prices.push(computePrice(db[i]))
                            // console.log("PREZZO COMPUTATO", await computePrice.computePrice(collection, db[i], decoded.email, startDate, endDate));
                            console.log("//////////////////////////////////");
                            console.log("startDate" + startDate);
                            console.log("endDate" + endDate);
                            prices.push(await computePrice.computePrice(collection, db[i], decoded.email, startDate, endDate));
                        }

                    }
                    //     let best = [];
                    //    productList.forEach((element) => {
                    //        best.push(computePrice(element));
                    //    });
                    //calcolo il  prodotto più economico
                    if (availableProductList.length != 0) {
                        price = Math.min(...prices);
                        console.log("TUTTI I PREZZI ",prices);
                        console.log("IL MINORE", price);
                        //le posizioni sono le stesse
                        currentProd = availableProductList[prices.indexOf(price.toString())];                 
                        res.status(200).json({ prod: collection, finalPrice: price, availability: true, currProdName: currentProd.name });
                    } else {
                        console.log("bye bye modafoca");
                        res.status(200).json({ availability: false });
                    }
                })
            }
        })
    } else { // Se l'utente non è loggato ritorniamo la media del prezzo


        const collection = await category.findOne({ name: name });

        if (collection) {
            //TO-DO capire il checkout ed il prezzo
            let price = collection.price;
            let period = endDate.getTime() - startDate.getTime();
            period = period / (1000 * 3600 * 24);
            price = price * period;

            return (res.status(200).json({ prod: collection, finalPrice: price }));
        }
    }
});



module.exports = router;