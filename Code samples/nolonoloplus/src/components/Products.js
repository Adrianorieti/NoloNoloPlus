import React from 'react';
import {useEffect, useState} from 'react';


function Products(){
 //state per il booleano che servirà a dire se la data è disponibile o meno
 //però per avere il booleano devi per forza essere loggato altrimenti il server non 
 //te lo manda
    const [toInsert, setToInsert] = useState(null);
    const form_obj = sessionStorage.getItem('form_obj');


    function getProducts(){
    const token = sessionStorage.getItem('token');
    const form_obj = sessionStorage.getItem('form_obj');
    const options = {
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json' , 'Authentication': `Bearer ${token}`}),
        body: form_obj
      };
      let url = 'http://localhost:8001/api/products'; //qui bisogna fare tutta la parte server side.
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) =>{
          console.log("EVVIVA");
          //PRENDO IL BOOLEANO AVAILABILITY PER CAPIRE COSA FARE
          setToInsert(data.prod.name);
        })
        .catch(error => {
          console.log(error);
        });
    }


  useEffect(() =>
  {
    getProducts();
   
  });

 //fare una richiesta al server per avere tutte le categorie mandandogli il token se siamo loggati
 //query se non è null dovrebbe contenere la risposta del server alla query dei parametri di RentForm
    // if(props.query === null)
    // {
    //         //allora hanno cliccato products dal navbar
    //         return(<h1><p>QUERY È NULL</p></h1>)
    // }else{
    //     //c'è stata una query dal form
    //     return(<h1><p>{props.query.finalPrice}</p></h1>)
    // }
     return(form_obj ? toInsert : <h1>Pagina dei prodotti normale loggato o meno</h1>);
}

export default Products;