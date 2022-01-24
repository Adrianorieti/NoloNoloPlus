const sortBy = require('./sortBy');
const computePrice = require('./computePrice');
const _ = require('underscore');
module.exports = {

    checkAvailability: function(product, startDate, endDate)
    {
        console.log("DENTRO CHECK", product);
        let available = true;
        console.log(product.futureReservations.length);
      
            if(product.activeReservations.length > 0)
            {     
                console.log("non è vuoto")
                product.futureReservations.push(product.activeReservations[0]); // altrimenti c'è la possibilità che il sistema dia disponibile per il giorno dopo mentre non lo è
            }else
            {
                console.log("è vuotooooooo")
            }
            if(product.futureReservations.length > 1)
                sortBy.sortByTime(product.futureReservations, 'start');
                for(let i in product.futureReservations)
                {
                    console.log("product future Reservation", product.futureReservations)
                    if( startDate.getTime() >= product.futureReservations[i].start.getTime() && startDate.getTime() <= product.futureReservations[i].end.getTime() )
                    {
                        //comprende tutto
                        available = false;
                        break; 

                    }else if( endDate.getTime() >= product.futureReservations[i].start.getTime() && endDate.getTime() <= product.futureReservations[i].end.getTime())
                    {
                        //la fine è compresa
                        available = false;
                        break;

                    }else if( startDate.getTime() <= product.futureReservations[i].start.getTime()  &&  endDate.getTime() >=  product.futureReservations[i].end.getTime())
                    {
                        //comprende tuttp
                        available = false;
                        break;
                    }else
                    {
                        // essendo ordinato appena trovo una inferiore esco dal for
                        break;
                    }
                }
         
        console.log("available è ", available)
        return available;
    }

}