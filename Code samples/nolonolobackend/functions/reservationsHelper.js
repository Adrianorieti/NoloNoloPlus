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
    searchReservation: function(reservations, toChange, x, end, start)
    {
        console.log("DENTRO SEARCH RESERVATION ")
        console.log("start", start.getDate());
        console.log("end",end.getDate());
        toChange= '';
         x = 0;
        for(x in reservations)
        { 
            console.log("reservation x",reservations[x])
            if(reservations[x].end.getTime() === end.getTime() && reservations[x].start.getTime() === start.getTime())
               { 
                   toChange = reservations[x];
                   break;
                }
        }    
        console.log(toChange);
        return([toChange, x])
    }
}