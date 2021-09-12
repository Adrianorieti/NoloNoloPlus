import React from "react";


function Test(){
   
    function call()
    {
        console.log(JSON.parse(sessionStorage.getItem("token")));
        const token = JSON.parse(sessionStorage.getItem("token"));
        console.log("Il token dentro test è "  + token);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8000/testami", true);
        // xhr.setRequestHeader("Content-type", 'application/json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + token );

        xhr.onload = function(){
        if(xhr.status == 200){

        console.log("Puoi andare");
        }else
        {
            console.log("non puoi andare");
            console.log(token);
        }
        
    };
    xhr.send();
    }


   call();
    
   return (<div><h1>Successo</h1></div>);
     
    
}

export default Test;