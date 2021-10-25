// Authentication module
const auth = require('./auth');

// Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduleUser');
const product = require('./moduleProduct');
const category = require('./moduleCategory');
const reservation = require('./moduleReservation');
const app = express();

// Json web token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Cross-Origin-Resource-Sharing
var cors = require('cors');

//Bcrypt stuff 
const bcrypt = require('bcrypt');

//Database url
var url = process.env.URL;

//Connect and start express services
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));


// These API's answer an url query with static files
// This is required so the client can use React routes

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

app.get("/personalpage", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get("/updatepage", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Server API's

app.post('/api/register', async (req, res) => {

    const mail = req.body.email;

    const source = await user.findOne({ email: mail });
    console.log(source);

    if (!(source)) {
        //password arrives in base-64
        const password = req.body.password;

        //password is decoded
        const buff = Buffer.from(password, 'base64');
        const decodedpass = buff.toString('utf-8');


        //password is hashed and salted
        const hash = await bcrypt.hash(decodedpass, 10, function (err, hash) {

            let newUser = new user({
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: req.body.email,
                password: hash,
                role: 'customer'
            });

            //user is saved in mongodb
            newUser.save();

            res.status(200).send();


        })
    } else {
        console.log(' Errore esiste già la mail');
        res.status(500).send({ error: 'Mail already exists' });
    }
});

app.post('/api/login', async (req, res) => {

    const mail = req.body.email;

    //We check if user exists in database
    const source = await user.findOne({ email: mail });

    if (source) {

        const password = req.body.password;

        const buff = Buffer.from(password, 'base64');

        const decodedpass = buff.toString('utf-8');

        // If user exists we compare the password
        if (await bcrypt.compare(decodedpass, source.password)) {

            console.log("Success");

            //CREATE  JWT
            const user = { email: `${source.email}` };
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_KEY, { expiresIn: '1h' });

            //Send token back to client 
            res.json({ accessToken: accessToken, name: `${source.name}` });

        } else {
            console.log("Password doesn't match");
        }
    } else {
        console.log('Errore la mail non esiste');
        res.status(500).send({ error: 'Mail not exists' });
    }
})

app.post('/api/email-validation', async (req, res) => {
    const email = req.body.email;
    let source = await user.findOne({ email: email });
    if (!source) {
        //nessuno è stato trovato con la mail che stiamo per inserire.
        res.status(200).send();
    }
    else {
        res.status(401).send();
    }
})

app.post('/api/passw-validation', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        //VA SETTATO PROB LO STATO DI ERRORE.
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            let source = await user.findOne({ email: email });
            const password = req.body.oldPassword;
            const buff = Buffer.from(password, 'base64');

            const decodedpass = buff.toString('utf-8');
            if (await bcrypt.compare(decodedpass, source.password)) {
                //le due password coincidono, allora mando uno status 200
                res.status(200).send();
            } else {
                res.status(401).send();
            }
        });
    }
})

app.post('/api/update', async (req, res) => {
    //VANNO SETTATI PER BENE GLI STATI DI ERRORE.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            //devo handlare il fatto se c'è un errore.
            const email = decoded.email;
            console.log(email);
            //diamo per scontato che lo user esista??
            //in questo caso si perchè prendiamo dal token, ma se uno lo modifica?
            let source = await user.findOne({ email: email });
            console.log(source);

            //adesso dobbiamo in un qualche modo leggere quello che vogliamo cambiare, e cambiarlo
            const data = req.body;

            switch (data.type) {
                case 'name':
                    source.name = data.name;
                    break;
                case 'surname':
                    source.surname = data.surname;
                    break;
                case 'phone':
                    source.phone = data.phone;
                    break;
                case 'email':
                    source.email = data.email;
                    break;
                default:
                    //SIAMO NELLA PARTE DELLE PASSWORD
                    const password = req.body.newPassword;
                    const buff = Buffer.from(password, 'base64');
                    const decodedpass = buff.toString('utf-8');
                    const hash = await bcrypt.hash(decodedpass, 10, function (err, hash) {
                        source.password = hash;
                        source.save();
                        res.status(200).send();
                    });
                    break;
            }
            if (data.type !== 'password') {
                source.save();
                res.status(200).send();
            }
        });
    }
})

app.post("/api/getInfo", async (req, res) => {
    //fare cose 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //anche questo if è un attimo da capire e fare meglio.
    if (token == null) {
        console.log("401");
        return res.sendStatus(401);//va rifatto
    }
    else {
        jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
            const email = decoded.email;
            let source = await user.findOne({ email: email });
            if (source) {
                let info = {
                    name: source.name,
                    surname: source.surname,
                    phone: source.phone,
                    email: source.email
                }
                res.json(JSON.stringify(info));
            }
            else {
                res.status(500).send();
            }
        });
    }
})

app.get("/api/dashboard", auth.verifyToken, auth.verifyAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});


app.get("/api/authLog", auth.verifyToken, (req, res) => {
    res.sendStatus(200);
});

app.post('/api/products', async (req, res) => {
    let prodList = [];
    //questo ci aiuta ad iterare su tutti gli elementi della collezione
 for await (const doc of category.find()) {
    prodList.push(doc);
  }
  res.status(200).json({prodList: prodList});
})  

// esegue l'update  su una reservation di un prodotto specifico
//prende il nome di un prodotto, l'inizio della reservation e la fine
app.post('/api/addRent', async(req, res) =>{

    let productName = req.body.name;
    let startDate = req.body.startingDate;
    let endDate = req.body.endingDate;
    console.log(productName)
    console.log(startDate)
    console.log(endDate)
    let prod = await product.findOne({name: productName});
    console.log(prod);
    let newReserve = new reservation({
        start: `${startDate}`,
        end: `${endDate}`
    })
    console.log(newReserve);
    //il giro dell'oca
    let newReservations =  prod.reservations;
    newReservations.push(newReserve);
    //TO-DO ORDINARE L'ARRAY IN MODO CHE SIA CRESCENTE 
    //così abbiamo tutte le prenotazioni su un determinato prodotto in ordine
    //nel caso il dipendente debba metterlo in manutenzione può facilmente capire quale sarebbe la prossima reservation
    
//vado a fare l'update dell'array di reservations DEL PRODOTTO SINGOLO
     product.updateOne({ name: productName }, {
        reservations: newReservations
      });})
      
app.post('/api/formProducts', async(req, res) =>
{
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
    console.log("Il token è", token);
   const name = req.body.name;
   console.log("START DATE", req.body.startingDate)

   let startDate = new Date(req.body.startingDate);
   startDate.setDate(startDate.getDate() + 1);
   console.log("START DATE", startDate);
   let endDate = new Date(req.body.endingDate);
   endDate.setDate(endDate.getDate() + 1);


   if(startDate.getTime() > endDate.getTime())
   {
       let tmp = startDate;
       startDate = endDate;
       endDate = tmp;
   }
  
   if(token) //  Siamo loggati 
   {
    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        if(err) 
            console.log(err);

        //PRENDO LA CATEGORIA DELL'OGGETTO
        const collection =  await category.findOne({name: name});
        //il nome della categoria è il tipo dei prodotti
        let typeToFind = collection.name;
        if(collection)
        {
            let price ;
            let period = endDate.getTime() - startDate.getTime();
            //ANDIAMO A VEDERE SUI SINGOLI PRODOTTI SE C'È DISPONIBILITÀ
            let available = false;
            let currentProd;
            let availableProductList = [];
            let prices = [];
          product.find({type: typeToFind},   function(err, db){

            if(err) return(res.status(500).send(err));
        console.log(db);
        for(i in db) 
        {
            available=true;

            for(j in db[i].reservations)
            {
                let x = db[i].reservations[j];
              
                // nei primi due if controlliamo che inizio o fine della prenotazione richiesta
                //sia nel mezzo di un'altra, nell'ultimo se ne contiene un'altra già esistente
                if( startDate.getTime() >= x.start.getTime() && startDate.getTime() <= x.end.getTime() )
                {
                    console.log("l'inizio è compreso");
                    available = false;
                    break; // passo all'oggetto successivo non guardo tutte le altre reservation di quell'oggetto

                }else if( endDate.getTime() >= x.start.getTime() && endDate.getTime() <= x.end.getTime())
                {
                    console.log("la fine  è compresa");

                    available = false;
                    break;

                }else if( startDate.getTime() <= x.start.getTime()  &&  endDate.getTime() >=  x.end.getTime())
                {
                    console.log("comprende tutto");
                    available = false;
                    break;
                }

            }   

           if(available)
            {
                //IL PRODOTTO SINGOLO CORRENTE NON LA CATEGORIA
                //dobbiamo fare in modo che sia il + economico
                //productList è un array di elementi disponibili in una determinata data
                availableProductList.push(db[i]);
                //aggiungo il prezzo finale di questo prodotto nell'array
                // prices.push(computePrice(db[i]))
                console.log("IL PREZZO DI QUESTO È", db[i].price);
                prices.push(db[i].price);
                // currentProd = db[i].name;
                // price = db[i].price;
                // period = period / (1000 * 3600 * 24);
                // price = price * period;
                // res.status(200).json({prod: collection, finalPrice: price, availability: available, currProdName: currentProd});
                // break;
            }

        }
    //     let best = [];
    //    productList.forEach((element) => {
    //        best.push(computePrice(element));
    //    });
    //calcolo il  prodotto più economico
       price = Math.min(...prices);
       console.log("TUTTI I PREZZI ",prices);
       console.log("IL MINORE", price);
       //le posizioni sono le stesse
       currentProd = availableProductList[prices.indexOf(price)];
        res.status(200).json({prod: collection, finalPrice: price, availability: available, currProdName: currentProd});
    })
    }
})
}else{ // l'utente non è loggato quindi calcoliamo la media del prezzo 
    
    const prod =  await category.findOne({name: name});

    if(prod)
    {
        //TO-DO capire il checkout ed il prezzo
        let price = prod.price;
        let period = endDate.getTime() - startDate.getTime();
        period = period / (1000 *3600 * 24);
        price = price * period;
        return(res.status(200).json({prod: prod, finalPrice: price}));
    }
}
});




////// PRODUCT TESTING

// let newProduct = new product({
//     name: "Electric S_300",
//     quantity: 1,
//     status: "New",
//     type: "Electric",
//     reservations: [
//         {
//             start: "06/10/2020",
//             end : "08/16/2020"
//         },
//         {
//             start: "10/04/2020",
//             end : "11/04/2020"
//         }
//     ]});

//     let newProduct2 = new product({
//         name: "Bike2000",
//         quantity: 1,
//         status: "New",
//         type: "Electric",
//         reservations: [
//             {
//                 start: "05/10/2020",
//                 end : "05/16/2020"
//             },
//             {
//                 start: "09/04/2020",
//                 end : "10/04/2020"
//             }
//         ]});
// let newProduct3 = new product({
//     name: "Bike2000",
//     quantity: 1,
//     status: "New",
//     type: "Electric",
//     reservations: [
//         {
//             start: "02/10/2020",
//             end : "03/16/2020"
//         },
//         {
//             start: "06/24/2020",
//             end : "07/04/2020"
//         }
//     ]});

//newCategory.save();
//newProduct.save();
// newProduct2.save();
// newProduct3.save();

app.listen(8001, function () {
    console.log('Server is running on port 8001');
});

 