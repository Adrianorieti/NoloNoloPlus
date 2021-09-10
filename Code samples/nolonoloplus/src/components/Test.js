import React from "react";


function Test(){
   

    function call()
    {
        const xhr = new XMLHttpRequest();
        let token = JSON.parse(localStorage.getItem("token"));
        console.log("dentro test in react " + token );
        xhr.open("GET", "http://localhost:8000/testami", true);
        // xhr.setRequestHeader("Content-type", 'application/json');
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onload = function(){
        if(xhr.status == 200){

            
        }
   
    };
    xhr.send();
    }


    call();
    
        return(
            <div><h1>Prova</h1></div>
        );
    
}

export default Test;