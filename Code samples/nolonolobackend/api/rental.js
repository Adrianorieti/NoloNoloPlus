const pendingRequest = require('../schemas/modulePendingRequest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const product = require('../schemas/moduleProduct');
const reservation = require('../schemas/moduleReservation');
//DA ELIMINARE
const user = require('../schemas/moduleUser');


const express = require('express');
const router = express.Router();

//Prende il token dell'utente che ha fatto la prenotazione, il nome del prodotto, inizio e fine prenotazione
// Inizialmente il campo employee della prenotazione è null, prima deve essere accettata
// 1) Aggiunge la prenotazione al prodotto
// 2) Aggiunge alla collezione di richieste pendenti dei dipendenti la prenotazione
// Quando un qualsiasi dipendente accetterà la richiesta allora questa verrà messa nell'array dello user ( verde, rossa)
// Se non viene accettata la cancelliamo anche dal prodotto, la mettiamo nel prodotto così diciamo viene " bloccato per quella data"
router.post('/addRent', async (req, res) => {

    //CONTROLLO IL TOKEN PER PRIMA COSA, DAL QUALE ESTRAGGO LA MAIL
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader != null) {
        token = authHeader && authHeader.split(' ')[1];
    }
    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, async function (err, decoded) {
        let userMail = decoded.email;
        let productName = req.body.name;
        let startDate = new Date(req.body.startingDate);
        let endDate = new Date(req.body.endingDate);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
       
       //cerco il prodotto
    let prod = await product.findOne({name: productName});
    // Controllo se nel frattempo non si sono fregati il prodotto
    let reservations = prod.reservations;
    let available = true;
    for(i in reservations)
    {
        if( startDate.getTime() >= reservations[i].start.getTime() && startDate.getTime() <= reservations[i].end.getTime() )
        {
            console.log("l'inizio è compreso");
            available = false;
            break; // passo all'oggetto successivo non guardo tutte le altre reservation di quell'oggetto

        }else if( endDate.getTime() >= reservations[i].start.getTime() && endDate.getTime() <= reservations[i].end.getTime())
        {
            console.log("la fine  è compresa");

            available = false;
            break;

        }else if( startDate.getTime() <= reservations[i].start.getTime()  &&  endDate.getTime() >=  reservations[i].end.getTime())
        {
            console.log("comprende tutto");
            available = false;
            break;
        }
    }
    if(available)
    {
        
        //creo una nuova reservation
        let newReserve = new reservation({
            usermail: userMail,
            start: `${startDate}`,
            end: `${endDate}`
        })
        console.log(" NEW RESERVE", newReserve);
        prod.reservations.push(newReserve);
        prod.save();
        //ora vado ad inserire la reservation nelle richieste pending
        // così i dipendenti avranno la richiesta pendente
        let newPendingReq = new pendingRequest({
            usermail: userMail,
            product: prod.name,
            start: `${startDate}`,
            end: `${endDate}`
        })  
        // Controlliamo se la pending request esiste già prima di inserirla
    let exist = await pendingRequest.findOne({ usermail: userMail, product: prod.name, start: `${startDate}`,}) 
    if(exist)
    {
        console.log("c'è già !!!");
        res.status(400).json({message: "The reserve is already present"});
    }else{
        console.log("lo metto");    
        newPendingReq.save();    
        res.status(200).json({message: "All went good :)"});
    }
}
})
})


module.exports = router;