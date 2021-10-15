import React from 'react';
import {useEffect, useState} from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import { useHistory } from "react-router";

function Products(){

    //ci serve per capire se siamo in un caso o nell'altro
    const obj = sessionStorage.getItem('form_obj'); 

    const [toInsert, setToInsert] = useState([]);
    const [formDataProduct, setformDataProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(true);
    const [loggato, setloggato] = useState(false);
    
    let history = useHistory();

    //funzione che gestisce i prodotti derivati dal form_obj
    function getFormProducts(){

    const token = JSON.parse(sessionStorage.getItem('token'));
    // Prendiamo dal session storage la query del form della home
    const form_obj = sessionStorage.getItem('form_obj');
    console.log("form obj è", form_obj);
    const options = {
      // Creiamo il payload da mandare al server
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json' , 'Authorization': `Bearer ${token}`}),
        body: form_obj
      };
      //la api formProducts gestisce le richieste quando arriviamo dalla home
      let url = 'http://localhost:8001/api/formProducts'; 
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) =>{
          //usiamo queste 3 states per prender i dati che ci servono dal server
          setAvailable(data.availability);
          setformDataProduct(data.prod);
          setPrice(data.finalPrice);
          //non è detto che ci sia a seconda che siamo loggati o meno 
          //per questo faccio questo controllo
          
                 })
        .catch(error => {
          console.log(error);
        });
    }

    //questa funzione gestisce l'arrivo sulla pagina dei prodotti dalla navbar
    function getAllProducts(){

      const options = {
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json', "Access-Control-Allow-Origin": "*"}),
      };
      //l'api products ci restituisce tutti i prodotti
      let url = 'http://localhost:8001/api/products';
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) => {
          //inseriamo dentro lo state toInsert la lista di prodotti
         setToInsert(toInsert.concat(data.prodList));
        })
        .catch(error => {
          console.log(error);
        });
    }

   useEffect(() =>
  {
    const form_obj = sessionStorage.getItem('form_obj'); 
    const token = JSON.parse(sessionStorage.getItem("token"));
    if(token)
      setloggato(true);
    if(form_obj)
    {
      //se form_obj c'è allora stò arrivando dalla home dopo aver messo dei filtri
      console.log("Form obj c'è")
      getFormProducts();
    }
    else
    {
      //se form_obj è null allora stiamo accedendo alla product page dal navbar e quindi
      //la cosa è semplice, vogliamo tutti i prodotti senza filtri di genere
      console.log("Form obj non c'è");
      getAllProducts();
       
    }

    
  },[]);

    // questo return è un if, SE C'È OBJ vuoldire che arrivo dalla home dopo aver compilato il form
  return (obj ? (<div className="product">
     <div className="card m-3" style={{width: "18rem"}}>
{/* questa funzione inline gestisce i diversi prodotti e gli dà l'immagine prestabilita */}
{(() => {
      if (formDataProduct.name === "Electric S_300") {
        return (
          <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
      } else if (formDataProduct.name === "Mountain Bike X_300") {
        return (
          <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      } else {
        return (
          <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
    })()}
    
<div className="card-body">
  <h5 className="card-title">{formDataProduct.name}</h5>
  <p className="card-text">{formDataProduct.description}</p>
  {/* Se l'utente non è loggato non deve vedere rent ma ipotesi */}
  {(() =>{
        if(loggato)
        {//se il prodotto è disponibile ok altrimenti errore per l'utente loggato e basta
          console.log("dentro l'if sono loggato");
          if(available){
            return(<a href="#" className="btn btn-primary">Rent this product</a>)
          }
          else{         
            return(<a className="btn btn-danger">Sorry the requested date is not available</a>)
          }       
        }
        else{return(<a href="#" className="btn btn-primary" id="rental">Make a rental hypothesis !</a>
        )}
      })()}
  {/* <a href="#" className="btn btn-primary">Rent this product</a>
  <a href="#" className="btn btn-primary" id="rental">Make a rental hypothesis !</a> */}

</div>
</div>
<a href="#" className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); window.location.reload()})}>Disable Filters</a>
  </div> ) : (<div className='product'>{toInsert.map((product) =>
    
    <div className="card m-3" style={{width: "18rem"}}>
{/* questa funzione inline gestisce i diversi prodotti e gli dà l'immagine prestabilita */}
  {(() => {
        if (product.name === "Electric S_300") {
          return (
            <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
            )
        } else if (product.name === "Mountain Bike X_300") {
          return (
            <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
        } else {
          return (
            <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
          )
        }
      })()}
      
  <div className="card-body">
    <h5 className="card-title">{product.name}</h5>
    <p className="card-text">{product.description}</p>
      {/* Se l'utente non è loggato non deve vedere rent ma ipotesi */}
      {(() =>{
        if(loggato){return(<a href="#" className="btn btn-primary">Rent this product</a>)}
        else{return(    <a href="#" className="btn btn-primary" id="rental">Make a rental hypothesis !</a>
        )}
      })()}
   

  </div>
</div>
  
    )}
    {/* Questo pulsante lo usiamo per eliminare form_obj dal session storage perchè altrimenti rimarrebbe sempre */}
    <a href="#" className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); history.push('/products')})}>Disable Filters</a>

    </div>));
}

export default Products;