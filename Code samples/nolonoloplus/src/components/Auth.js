import React from 'react';

async function isLog()
{
    const token = JSON.parse(sessionStorage.getItem("token"));
    console.log("dentro isLog");

    if(token)
    {
               console.log("dentro token");
               let res = await fetch("http://localhost:8001/api/authLog", {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`
               }
            })
            if(res.status == 200)
                return true;
            else
                return false;
    }else{
        return false;
    }

    
  
}

export default isLog;