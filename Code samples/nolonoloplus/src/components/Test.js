import React from "react";


function Test(){
   
    let data = '';
    function call()
    {
        const xhr = new XMLHttpRequest();
        let token = JSON.parse(localStorage.getItem("token"));
        xhr.open("GET", "http://localhost:8000/testami", true);
        // xhr.setRequestHeader("Content-type", 'application/json');
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onload = function(){
        if(xhr.status == 200){

        console.log("Puoi andare");
        }else
        {
            console.log("non puoi andare");
        }
        
    };
    xhr.send();
    }


   call();
    
       return (<div><h1>Successo</h1></div>);
     
    
}

export default Test;