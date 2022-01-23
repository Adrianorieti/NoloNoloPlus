const user = require('../schemas/moduleUser');
const discount = require('../schemas/moduleDiscount');


module.exports = {
    computePrice: async function (category, product, userMail, userObject, startDate, endDate) {
        let usr;
        if(userObject === '')
             usr = await user.findOne({ email: userMail });
        else
            usr = userObject;
        if (!usr) {
            //nessuno è stato trovato con la mail che stiamo per inserire.
            res.status(401).send("User non trovato");
        }
        else {

            const fidelityPoints = usr.fidelityPoints;
            const discountCode = category.discountCode;
            let dailyPrice = product.price;
            let finalPrice = 0;
            // Sconto totale che il cliente vedrà in fattura
            let totalDiscount = 0;
            // Andiamo a prendere il discount Rate associato al discountCode
            let discountElement = await discount.findOne({ discountCode: discountCode });
            //da calcolare come percentuale sul prezzo
            const discountRate = discountElement.discountRate;
            // Il segno che mi dice se devo sommare o sottrarre
            const discountSign = discountElement.discountSign;

            if (discountSign === '+') // alta stagione
            {
                dailyPrice += ((dailyPrice * discountRate) / 100);
                totalDiscount -= discountRate;
            } else // bassa stagione
            {
                dailyPrice -= ((dailyPrice * discountRate) / 100);
                totalDiscount += discountRate;
            }
            // Prezzo basico del periodo (quindi di alta o bassa stagione ecc)
            console.log("finalPrice", finalPrice);
            let period = endDate.getTime() - startDate.getTime();
             period = period / (1000 * 3600 * 24);
            //così mi prende  anche il giorno finale altrimenti non me lo prende
             period += 1;
            finalPrice = dailyPrice * period;
            console.log("period", period);
            console.log("finalProce", finalPrice);

            // Se inizio il venerdì e la prenotazione dura 3 o + giorni allora sconto
            if (startDate.getDay() === 6) {
                startDate.setDate(startDate.getDate() + 2);
                if (startDate.getTime() <= endDate.getTime()) {
                    finalPrice -= (((finalPrice * 7) / 100));
                    totalDiscount += 2;
                }
                startDate.setDate(startDate.getDate() - 2);
                //qui controllo se inizio dal lunedì e dura + di 3 giorni in totale
            } else if (startDate.getDay() === 1) {
                startDate.setDate(startDate.getDate() + 2);
                if (startDate.getDate() <= endDate.getDate()) {
                    finalPrice -= (((finalPrice * 7) / 100));
                    totalDiscount += 2;
                }
                startDate.setDate(startDate.getDate() - 2);
            }
            // Prenotazioni più lunghe di 12 giorni

            if (period > 12) {
                finalPrice -= ((finalPrice * 4) / 100);
                totalDiscount += 4;
            }

            if (fidelityPoints > 50 && fidelityPoints <= 90) { // siamo nella prima fascia di sconto quindi tipo 2%
                finalPrice -= ((finalPrice * 4) / 100);
            } else if (fidelityPoints > 90 && fidelityPoints <= 200) {// siamo nella seconda fascia di sconto quindi tipo 4%
                finalPrice -= ((finalPrice * 5) / 100);
                totalDiscount += 5;
            } else if (fidelityPoints > 200 && fidelityPoints <= 300) {
                //siamo nella terza fascia di sconto quindi 5%
                finalPrice -= ((finalPrice * 7) / 100);
                totalDiscount += 7;
            } else if (fidelityPoints > 300) {
                finalPrice -= ((finalPrice * 10) / 100);
                totalDiscount += 10;
            }
            if (totalDiscount < 0)
                totalDiscount = 0; // cioè non abbiamo fatto nessuno sconto bensì una maggiorazione
                finalPrice = parseInt(finalPrice.toFixed(2));
           console.log("fine compute price", finalPrice);
            return (finalPrice);
        }

    }
}