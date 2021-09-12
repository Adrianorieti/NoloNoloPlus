import React, { useEffect } from "react";
import {useState} from 'react';


function Test(){

    const [error, setError] = useState(null);
    const [items, setItems] = useState('');

    useEffect(() => {

        const token = JSON.parse(sessionStorage.getItem("token"));
        console.log("Il token dentro test è "  + token);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8000/testami", true);
        // xhr.setRequestHeader("Content-type", 'application/json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + token );

        xhr.onload = function(){
        if(xhr.status == 200){

            setItems(xhr.responseText);

        }
        else
        {
            
           setError(xhr.responseText);
        }
        
    };
    xhr.send();
}, []);



    if(error !== null)
    {
        console.log(error);
        return (<div><h1>Error: {error}</h1></div>);
    }else
    {
        return <div>item: {items}</div>;
    }

}

    
    // let data = '';
    // function call()
    // {
    //     console.log(JSON.parse(sessionStorage.getItem("token")));
    //     const token = JSON.parse(sessionStorage.getItem("token"));
    //     console.log("Il token dentro test è "  + token);
    //     const xhr = new XMLHttpRequest();
    //     xhr.open("GET", "http://localhost:8000/testami", true);
    //     // xhr.setRequestHeader("Content-type", 'application/json');
    //     xhr.setRequestHeader("Authorization", 'Bearer ' + token );

    //     xhr.onload = function(){
    //     if(xhr.status == 200){

        
    //     console.log("Puoi andare");

    //     }
    //     else
    //     {
    //         data = xhr.responseText;
    //         console.log("non puoi andare");
           
    //     }
        
    // };
    // xhr.send();
    // }

//     console.log(JSON.parse(sessionStorage.getItem("token")));

//    call();
    
//    return (<div><h1>{}</h1></div>);
     
    


export default Test;