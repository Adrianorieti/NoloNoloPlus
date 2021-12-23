const sortBy = require('./sortBy');
const computePrice = require('./computePrice');

module.exports = {

    checkAvailability: function(product, startDate, endDate)
    {
        console.log("primo check");
        let reservations = product.reservations;
        if(reservations.length > 1)
            sortBy.sortByTime(reservations, 'start');
        console.log("secondo check");
        let available = true;
        // non dovrebbe mai accadere che sia nullo ma non si sa mai
        if(reservations)
        {
            console.log("qui ci entra ??");
            for(i in reservations)
            {
                if( startDate.getTime() >= reservations[i].start.getTime() && startDate.getTime() <= reservations[i].end.getTime() )
                {
                    console.log("l'inizio è compreso");
                    available = false;
                    break; 

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
                }else
                {
                    // essendo ordinato appena trovo una inferiore esco dal for
                    break;
                }
            }
        }   
        console.log("available", available);
        return available;
    }

}