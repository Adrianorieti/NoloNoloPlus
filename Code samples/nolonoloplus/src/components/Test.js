import React, { useEffect } from "react";
import {useState} from 'react';


function Test(){

    const [error, setError] = useState(null);
    const [items, setItems] = useState('');

    function test()
    {
        // let field = $('#changeMenu').val();
        // let newValue = $('#newValue').val();
        // console.log(name);
        // console.log(field);
        // console.log(newValue);

        const obj = `{
            "name": "accalappialappia"
        }`;
        const options = {
            method: 'GET',
            // headers: new Headers({ 'Content-type': 'application/json'}),
            // body: obj
          };
            const url = `http://localhost:8001/api/products/`;
            fetch(url, options)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            }).then((data) =>{
            console.log(data);
        }).catch(error => {
            console.log(error);
          });
    }

    useEffect(() => {
        console.log('ciaooo');
       test();
   
}, []);
return null;    

}

    

    


export default Test;