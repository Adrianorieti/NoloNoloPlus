// const reservation = require('../schemas/moduleReservation').model;

module.exports = {
    createReservation: function(userMail, employeeMail, productName, expense, startDate, endDate, modify)
    {
      
        const newReserve =  {
            usermail: userMail,
            employee: employeeMail,
            product: productName,
            expense: expense,
            start: startDate,
            end: endDate,
            modify: modify
        }
        return newReserve;
    },
    searchReservation: function(reservations, toChange, x, end, start)
    {
        
        toChange= '';
         x = 0;
        for(x in reservations)
        { 
            // console.log("st",start);
            // console.log("end",end);
            // console.log("res st",reservations[x].start)
            // console.log("res end",reservations[x].end)
            // console.log("newgironewcorsa");
            if(reservations[x].end.getTime() === end.getTime() && reservations[x].start.getTime() === start.getTime())
               { 
                   toChange = reservations[x];
                   break;
                }
        }    
        return([toChange, x])
    }
}