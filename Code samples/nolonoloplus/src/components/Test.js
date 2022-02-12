import React, { useEffect } from "react";
import {useState} from 'react';


function Test(){

    const [error, setError] = useState(null);
    const [items, setItems] = useState('');

    function test()
    {
        
        console.log("parto");
        let name = 'Electric S_300';
        let start= "2021-12-15";
        let end = "2021-12-17";

        const options = {
            method: 'GET',
          };
            const url = `http://site202145.tw.cs.unibo.it/api/categories/${name}/available/?start=${start}&end=${end}`;
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