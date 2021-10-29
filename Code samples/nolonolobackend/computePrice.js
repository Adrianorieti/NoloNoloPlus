const user = require('./moduleUser');
const discount = require('./moduleDiscount');


module.exports = {
// prende in input la categoria del prodotto, il prodotto, la mail dello user (dentro il token) per cercarlo nel database e prenderne i pf e la spesa totale
//le date di inizio e fine
    computePrice: async function(category, product, userMail, startDate, endDate)
    {
        // Cerco l'utente tramite mail
        let usr =  user.findOne({ email: userMail });
        if (!usr) {
        //nessuno è stato trovato con la mail che stiamo per inserire.
        res.status(401).send();
         }
         else {
             console.log("giorno della settimana ", startDate.getDay());
           
            const fidelityPoints = usr.fidelityPoints;
            const discountCode = category.discountCode;
            let dailyPrice = product.price;
            let finalPrice;
            // Sconto totale che il cliente vedrà in fattura
            let totalDiscount = 0;

             // Andiamo a prendere il discount Rate associato al discountCode
            let discountElement = await discount.findOne({discountCode: discountCode});
            //da calcolare come percentuale sul prezzo
            const discountRate = discountElement.discountRate;
            // Il segno che mi dice se devo sommare o sottrarre
            const discountSign = discountElement.discountSign;
            console.log("Daily price 1:" , dailyPrice);

            if(discountSign === '+')
            {
                console.log("sign funziona");
                dailyPrice += ((dailyPrice * discountRate) / 100) ;
                totalDiscount += discountRate;
            }else
            {
                console.log("sign funziona");
                dailyPrice -= ((dailyPrice * discountRate) / 100) ;
                totalDiscount += discountRate;

            }
            console.log("Daily price 2 :" , dailyPrice);
            // Prezzo basico del periodo (quindi di alta o bassa stagione ecc)
            let period = endDate.getTime() - startDate.getTime();
            period = period / (1000 * 3600 * 24);
            //così mi prende  anche il giorno finale altrimenti non me lo prende
            period += 1;
            console.log("giorni prenotati ", period);
            finalPrice = dailyPrice * period;

            console.log("final price 1: ", finalPrice);

             // Se inizio il venerdì e la prenotazione dura 3 o + giorni allora sconto
             if(startDate.getDay() === 6)
             {
                 console.log("primo step")
                startDate.setDate(startDate.getDate() + 2);
                console.log("startDate", startDate);
                console.log("endDate", endDate);
                if(startDate.getTime() <= endDate.getTime())
                {  
                    console.log("WEEKEND");
                    finalPrice -= (((finalPrice * 2) / 100));
                    totalDiscount += 2;
                }

                //qui controllo se inizio dal lunedì e dura + di 3 giorni in totale
             }else if(startDate.getDay() === 1)
             {
                startDate.setDate(startDate.getDate() + 2);
                if(startDate.getDate() <= endDate.getDate())
                {    
                     console.log("INFRASETTIMANALE");
                    finalPrice -= (((finalPrice * 2) / 100));
                    totalDiscount += 2;
                }
             }
             startDate.setDate(startDate.getDate() - 2);
             console.log("final price 2: ", finalPrice);


            if(fidelityPoints > 50 && fidelityPoints <= 90)
            { // siamo nella prima fascia di sconto quindi tipo 2%
                finalPrice += ((finalPrice * 2) / 100);
                totalDiscount += 2;

            }else if(fidelityPoints > 90 && fidelityPoints <= 200)
            {// siamo nella seconda fascia di sconto quindi tipo 4%
                finalPrice += ((finalPrice * 4) / 100);
                totalDiscount += 4;
            }else if(fidelityPoints > 200 && fidelityPoints <= 300)
            {
                //siamo nella terza fascia di sconto quindi 5%
                finalPrice += ((finalPrice * 5) / 100);
                totalDiscount += 5;
            }else if(fidelityPoints > 300 )
            {
                finalPrice += ((finalPrice * 6) / 100);
                totalDiscount += 6;
            }
            console.log("final price 3: ", finalPrice);

            return(finalPrice);
        }

    }
}