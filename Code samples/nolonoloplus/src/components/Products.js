import React from 'react';
import {useEffect, useState} from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import specialBike from '../images/specialBike.jpeg';
import cityBike from '../images/cityBike.jpg';
import { useHistory } from "react-router";
import Rental from './Rental';
function Products(){

    //ci serve per capire se siamo in un caso o nell'altro
    // let obj = sessionStorage.getItem('form_obj'); 
    const [obj, setObj] = useState(JSON.parse(sessionStorage.getItem('form_obj')));
    const [toInsert, setToInsert] = useState([]);
    const [formDataProduct, setformDataProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [loggato, setloggato] = useState(false);
    const [prodName, setProdName] = useState('');
    let history = useHistory();



    //funzione che gestisce i prodotti derivati dal form_obj
    function getFormProducts(){

    const token = JSON.parse(sessionStorage.getItem('token'));
    // Prendiamo dal session storage la query del form della home
    const form_obj = sessionStorage.getItem('form_obj');
    console.log("form obj è", form_obj);
    let options;
    if(token)
    {
       options = {
        // Creiamo il payload da mandare al server
          method: 'POST',
          headers: new Headers({ 'Content-type': 'application/json' , 'Authorization': `Bearer ${token}`}),
          body: form_obj
        };
    }else{
       options = {
        // Creiamo il payload da mandare al server
          method: 'POST',
          headers: new Headers({ 'Content-type': 'application/json'}),
          body: form_obj
        };
    }
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
          //nome del PRODOTTO singolo in questione e NON LA CATEGORIA
          setProdName(data.currProdName);
          //non è detto che ci sia a seconda che siamo loggati o meno 
          //per questo faccio questo controllo
                 }).catch(error => {
          console.log("ERRORE : ", error);
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
    console.log("IL TOKEN" , token);
    if(token) // sono loggato
      setloggato(true);
    if(form_obj) //arrivo dalla home ma se sono loggato non voglio vedere altro semplcimente andare ad inserire i dati per la prenotazione
    {
      //se form_obj c'è allora stò arrivando dalla home dopo aver messo dei filtri
      getFormProducts();
    }
    else // non arrivo dalla home
    {
      //se form_obj è null allora stiamo accedendo alla product page dal navbar e quindi
      //la cosa è semplice, vogliamo tutti i prodotti senza filtri di genere
      getAllProducts();
       
    }
  },[]);
  //ATTENZIONE DEVO SPOSTARE LA FUNZIONE DIRETTAMENTE DOPO IL PUNTO INTERROGATIVO PER VEDERE SE SONO LOGGATO O MENO , PERCHÈ
  //COSÌ POSSO REINDIRIZZARE IL CLIENTE LOGGATO
  return (obj ? ( <div className="product"> {(() =>
  {//se arrivo dalla home e sono loggato
    if(loggato){
      console.log("available è", available); // e il prodotto è disponibile per la data che ho scelto
        if(available)//continuo con il noleggio
          {
            // sessionStorage.removeItem('form_obj');
            console.log("CATEGORY NAME", formDataProduct.name );
            console.log("PRODUCT NAME", prodName);
            return(
              <Rental categoryName={formDataProduct.name} productName={prodName} startDate={obj.startingDate} endDate={obj.endingDate} price={price} description={formDataProduct.description}/>

            );
          }else {
            sessionStorage.removeItem('form_obj');
            return(<a className="btn btn-danger">Sorry the requested date is not available</a>);
          }
      }else{ // se arrivo dalla home ma non sono loggato
        return(<div> 
     <div className="card m-3" style={{width: "18rem"}}>
{/* questa funzione inline gestisce i diversi prodotti e gli dà l'immagine prestabilita */}
{(() => {
      if (formDataProduct.name === "Electric S_300") {
        return (
          <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
      } else if (formDataProduct.name === "Mountain Bike") {
        return (
          <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      } else if(formDataProduct.name == "City Bike"){
        return (
          <img src={cityBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(formDataProduct.name == "Special Bike"){
        return (
          <img src={specialBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(formDataProduct.name == "Scooter"){
        return (
          <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
    })()}
    
<div className="card-body">
  <h5 className="card-title">{formDataProduct.name}</h5>
  <p className="card-text">{formDataProduct.description}</p>
  <p className="card-text">The price for the requested period is : {price}$</p>
  <p id="check">Login to check availability for this product.</p>
</div>
</div>
<a href="#" className="btn btn-primary m-3" onClick={(()=>{sessionStorage.removeItem('form_obj'); window.location.reload()})}>Disable Filters</a>
  </div>)

      }
  })()}
   </div>) : (<div className='product'>{toInsert.map((product) =>
    
    <div className="card m-3" style={{width: "18rem"}}>

{/* questa funzione inline gestisce i diversi prodotti e gli dà l'immagine prestabilita */}
  {(() => {
        if (product.name === "Electric S_300") {
          return (
            <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
            )
        } else if (product.name === "Mountain Bike") {
          return (
            <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
        } else if(product.name == "City Bike"){
          return (
            <img src={cityBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
        }
        else if(product.name == "Special Bike"){
          return (
            <img src={specialBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
        }
        else if(product.name == "Scooter"){
          return (
            <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
          )
        }
      })()}
      
  <div className="card-body">
    <h5 className="card-title">{product.name}</h5>
    <div className="card-text"><p>{product.description}</p>
    <div className="card-text"><p>Medium price per day: {product.price}$</p>
      </div>
    </div>

{(() =>
{
  if(loggato)
   { return( 
    <button className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj');  history.push('/')})}>Rent this product. </button>)
  }else{return(<button className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); history.push('/')})}>Make a rental hypothesis ! </button>
  )}
})()}
         
  </div>
</div>
  
    )}
    {/* Questo pulsante lo usiamo per eliminare form_obj dal session storage perchè altrimenti rimarrebbe sempre */}
    <a  className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); history.push('/products')})}>Disable Filters</a>

    </div>));
}

export default Products;