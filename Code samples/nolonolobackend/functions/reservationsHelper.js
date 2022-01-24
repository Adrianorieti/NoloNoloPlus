// const reservation = require('../schemas/moduleReservation').model;

module.exports = {
    createReservation: function(userMail, employeeMail, productName, expense, startDate, endDate)
    {
      
        const newReserve =  {
            usermail: userMail,
            employee: employeeMail,
            product: productName,
            expense: expense,
            start: startDate,
            end: endDate,
            modify: 0
        }
        return newReserve;
    },
    searchReservation: function(reservations, toChange, x, end, start)
    {
        
        toChange= '';
         x = 0;
        for(x in reservations)
        { 
            console.log(start);
            console.log(end);
            console.log(reservations[x].start)
            console.log(reservations[x].end)
            if(reservations[x].end.getTime() === end.getTime() && reservations[x].start.getTime() === start.getTime())
               { 
                   toChange = reservations[x];
                   break;
                }
        }    
        return([toChange, x])
    }
}