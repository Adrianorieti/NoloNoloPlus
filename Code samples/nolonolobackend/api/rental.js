const pendingRequest = require('../schemas/modulePendingRequest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const product = require('../schemas/moduleProduct');
const reservation = require('../schemas/moduleReservation');


const express = require('express');
const router = express.Router();

//Prende il token dell'utente che ha fatto la prenotazione, il nome del prodotto, inizio e fine prenotazione
// Inizialmente il campo employee della prenotazione è null, prima deve essere accettata
// 1) Aggiunge la prenotazione al prodotto
// 2) Aggiunge alla collezione di richieste pendenti dei dipendenti la prenotazione
// Quando un qualsiasi dipendente accetterà la richiesta allora questa verrà messa nell'array dello user ( verde, rossa)
// Se non viene accettata la cancelliamo anche dal prodotto, la mettiamo nel prodotto così diciamo viene " bloccato per quella data"
router.post('/addRent', async(req, res) =>{

    //CONTROLLO IL TOKEN PER PRIMA COSA, DAL QUALE ESTRAGGO LA MAIL
    const authHeader = req.headers['authorization'];
    let token;
    if(authHeader != null)
     { 
         token = authHeader && authHeader.split(' ')[1];
     }
     jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function(err, decoded)
    {
        let userMail = decoded.email;
        let productName = req.body.name;
        let startDate = new Date(req.body.startingDate);
        let endDate = new Date(req.body.endingDate);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
       
       //cerco il prodotto
    let prod = await product.findOne({name: productName});
    console.log(prod);
    //creo una nuova reservation
    let newReserve = new reservation({
        usermail: userMail,
        product: prod.name,
        start: `${startDate}`,
        end: `${endDate}`
    })
    console.log(" NEW RESERVE", newReserve);
    //prendo l'array di reservation del prodotto, inserisco ed ordino
    let newReservations =  prod.reservations;
    newReservations.push(newReserve);
    //TO-DO ORDINARE L'ARRAY IN MODO CHE SIA CRESCENTE 
    //così abbiamo tutte le prenotazioni su un determinato prodotto in ordine
    //nel caso il dipendente debba metterlo in manutenzione può facilmente capire quale sarebbe la prossima reservation
    
//vado a fare l'update dell'array di reservations DEL PRODOTTO SINGOLO
product.updateOne({ name: productName }, {
    reservations: newReservations
})

//ora vado ad inserire la reservation nelle richieste pending
// così i dipendenti avranno la richiesta pendente
let newPendingReq = new pendingRequest({
    usermail: userMail,
    product: prod.name,
    start: `${startDate}`,
    end: `${endDate}`
})

//ATTENZIONE NON CONTROLLA SE ESISTE GIÀ UNA PRENOTAZIONE UGUALE
//magari usare findone prima per vedere se già esiste una entry completamente uguale con gli stessi campi, in quel caso non vado ad inserire
let exist = await pendingRequest.findOne({ usermail: userMail, product: prod.name, start: `${startDate}`,})
if(exist)
{
    console.log("c'è già !!!");
}else{
    console.log("lo metto");
    newPendingReq.save();

}


})
;})


module.exports = router;