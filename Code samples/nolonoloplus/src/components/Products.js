import React from 'react';
import {useEffect, useState} from 'react';


function Products(){
 //state per il booleano che servirà a dire se la data è disponibile o meno
 //però per avere il booleano devi per forza essere loggato altrimenti il server non 
 //te lo manda
    const [toInsert, setToInsert] = useState(null);

    //funzione che gestisce i prodotti derivati dal form_obj
    function getFormProducts(){
      console.log("richiesta al server");
    const token = sessionStorage.getItem('token');
    const form_obj = sessionStorage.getItem('form_obj'); // si ripete e va cancellato
    console.log("form_obj è", form_obj);
    const options = {
      // Creiamo il payload da mandare al server
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json' , 'Authentication': `Bearer ${token}`}),
        body: form_obj
      };
      let url = 'http://localhost:8001/api/formProducts'; //qui bisogna fare tutta la parte server side.
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) =>{

          console.log("EVVIVA");
          //qui toInsert prende il nome del prodotto
          setToInsert(data.prod.name);
        })
        .catch(error => {
          console.log(error);
        });
    }

    function getAllProducts(){
      // Creiamo il payload da mandare al server
    const options = {
        method: 'GET',
        headers: new Headers({ 'Content-type': 'application/json' , 'Authentication': `Bearer ${token}`}),
      };
      let url = 'http://localhost:8001/api/products';
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) =>{
          setToInsert(data);
        })
        .catch(error => {
          console.log(error);
        });
    }

  useEffect(() =>
  {
    //se form_obj è null allora stiamo accedendo alla product page dal navbar e quindi
    //la cosa è semplice, vogliamo tutti i prodotti senza filtri di genere
    const form_obj = sessionStorage.getItem('form_obj'); 
    if(form_obj)
      getFormProducts();
    else
      getAllProducts();

    //bisogna creare un'altra funzione che richiama sempre la stessa api ma con un booleano diverso
    //a seconda che arriviamo su questa pagina da navbar o da rentform
    
  });

    
     return(toInsert);
}

export default Products;