const sortBy = require('./sortBy');
const computePrice = require('./computePrice');

module.exports = {

    checkAvailability: function(product, startDate, endDate)
    {
        let available = true;
        if(product.futureReservations && product.futureReservations.length > 0)
        {
            if(product.activeReservation)
                product.futureReservations.push(product.activeReservation); // altrimenti c'è la possibilità che il sistema dia disponibile per il giorno dopo mentre non lo è
            if(product.futureReservations.length > 1)
                sortBy.sortByTime(product.futureReservations, 'start');
                for(let i in product.futureReservations)
                {
                    console.log(product.futureReservations[i])
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
        }   
        return available;
    }

}