import React from "react";
import {useEffect, useState} from 'react';


function Products(){


const [products, setProducts] = useState([]);
const [token, setToken] = useState('');

    
    useEffect(async () => {

        function getProducts(x)
        {
            let options = {
                method: 'GET'
            };
            let url = 'http://localhost:8001/api/products/';
            fetch(url, options)
            .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            }).then((data) => {
            setProducts(products.push(data[0]))
            console.log(products);
            })
            .catch(error => {
            console.log(error); // CAMBIARE
            });
    }


    setToken(JSON.parse(sessionStorage.getItem('token')));
  
    getProducts();


    },[])
  




    return(
        // se c'è il token renderizzo con pulsante per prenotare altrimenti per fare un'ipotesi
        // dopodichè se clicca ipotesi o l'altro li rimando alla pagina iniziale e da lì gestisco un'altra pagina
        // se è loggato farò apparire la schermata di conferma della prenotazione
        // se non è loggato farò apparire il risultato finale dell'ipotesi
        <div>{token ? <p>Il token esiste</p> : <p>il token non esiste</p>}</div>
    )
}


export default Products;