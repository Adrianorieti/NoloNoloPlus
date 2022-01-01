// const reservation = require('../schemas/moduleReservation').model;

module.exports = {
    createReservation: function(userMail, employeeMail, productName, expense, startDate, endDate)
    {
        // const newReserve = new reservation({
        //     usermail: userMail,
        //     employee: employeeMail,
        //     product: productName,
        //     expense: expense,
        //     start: startDate,
        //     end: endDate
        // })
        const newReserve =  {
            usermail: userMail,
            employee: employeeMail,
            product: productName,
            expense: expense,
            start: startDate,
            end: endDate
        }
        return newReserve;
    },
    searchReservation: function(reservations, toChange, x, start, end)
    {
        toChange= '';
         x = 0;
        for(x in reservations)
        { 
            if(reservations[x].end.getDate() === end.getDate() && reservations[x].start.getDate() === start.getDate())
               { 
                   toChange = reservations[x];
                   break;
                }
        }    
        return([toChange, x])
    }
}