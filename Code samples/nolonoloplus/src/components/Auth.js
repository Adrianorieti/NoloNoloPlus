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

      

    //     const xhr = new XMLHttpRequest();
    //     const token = JSON.parse(sessionStorage.getItem("token"));
    //     console.log("prima di token");

    //     if(token != null)
    //     {
    //         console.log("dopo di token");

    //         xhr.open("GET", "http://localhost:8001/api/authLog", true);
    //         xhr.setRequestHeader("Authorization", 'Bearer ' + token );
    //         xhr.onload = () =>
    //          {
    //             if(xhr.status == 200)
    //             {
    //                 console.log("true");
    //                 return true;
    //          }else
    //             {    
    //                 console.log("false");

    //                 return false;
    //             }
        
    //         }
    //     xhr.send();
    // }else{
    //     console.log("false");

    //     return false;
    // }
    // })
    // let result = await promise;
    // return(result);
  
}

export default isLog;