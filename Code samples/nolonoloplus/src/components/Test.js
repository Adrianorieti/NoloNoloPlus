import React, { useEffect } from "react";
import {useState} from 'react';


function Test(){

    const [error, setError] = useState(null);
    const [items, setItems] = useState('');

    useEffect(() => {

        const token = JSON.parse(sessionStorage.getItem("token"));
        console.log("Il token dentro test è "  + token);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8001/api/dashboard", true);
        // xhr.setRequestHeader("Content-type", 'application/json');
        xhr.setRequestHeader("Authorization", 'Bearer ' + token );

        xhr.onload = function(){
        if(xhr.status == 200){

            setItems(xhr.response);

        }
        else
        {
            console.log(xhr.response);
            console.log(xhr.responseText);
           setError(xhr.response);
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

    

    


export default Test;