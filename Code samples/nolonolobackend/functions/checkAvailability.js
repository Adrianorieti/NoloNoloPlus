const sortBy = require('./sortBy');
const computePrice = require('./computePrice');

module.exports = {

    checkAvailability: function(product, startDate, endDate)
    {
        product.futureReservations.push(product.activeReservation); // altrimenti c'è la possibilità che il sistema dia disponibile per il giorno dopo mentre non lo è
        if(product.futureReservations.length > 1)
            sortBy.sortByTime(product.futureReservations, 'start');
        let available = true;
        // non dovrebbe mai accadere che sia nullo ma non si sa mai
        if(product.futureReservations)
        {
            for(i in product.futureReservations)
            {
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