const sortBy = require('./sortBy');
const computePrice = require('./computePrice');
const _ = require('underscore');
module.exports = {

    checkAvailability: function(product, startDate, endDate)
    {
        let available = true;
        console.log(product.futureReservations.length);
      
            if(product.activeReservations.length > 0)
            {     
                product.futureReservations.push(product.activeReservations[0]); // altrimenti c'è la possibilità che il sistema dia disponibile per il giorno dopo mentre non lo è
            }
            if(product.futureReservations.length > 1)
                sortBy.sortByTime(product.futureReservations, 'start');
                for(let i in product.futureReservations)
                {
                    if( startDate.getTime() >= product.futureReservations[i].start.getTime() && startDate.getTime() <= product.futureReservations[i].end.getTime() )
                    {
                        // console.log("comprende tutto");
                        available = false;
                        break; 

                    }else if( endDate.getTime() >= product.futureReservations[i].start.getTime() && endDate.getTime() <= product.futureReservations[i].end.getTime())
                    {
                        // console.log("la fine è compresa");

                        available = false;
                        break;

                    }else if( startDate.getTime() <= product.futureReservations[i].start.getTime()  &&  endDate.getTime() >=  product.futureReservations[i].end.getTime())
                    {
                        // console.log("comprende tutto due");
                        available = false;
                        break;
                    }else
                    {
                        // essendo ordinato appena trovo una inferiore esco dal for
                        break;
                    }
                }
         
        // console.log("available è ", available)
        return available;
    }

}