import React from 'react';
import {useEffect, useState} from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import { useHistory } from "react-router";

function Products(){
 
    const obj = sessionStorage.getItem('form_obj'); 
    const [toInsert, setToInsert] = useState([]);
    const [formDataProduct, setformDataProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    let history = useHistory();

    //funzione che gestisce i prodotti derivati dal form_obj
    function getFormProducts(){

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

          setformDataProduct(data.prod);
          setPrice(data.finalPrice);
          setAvailable(data.availability);
        })
        .catch(error => {
          console.log(error);
        });
    }

    function getAllProducts(){

      // Creiamo il payload da mandare al server
    const options = {
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json', "Access-Control-Allow-Origin": "*"}),
      };

      let url = 'http://localhost:8001/api/products';
      fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then((data) => {

         setToInsert(toInsert.concat(data.prodList));

         //  setToInsert(data.prodList);
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
    {
      console.log("Form obj c'è")
      getFormProducts();
    }
    else
    {
      console.log("FOrm obj non c'è")

      getAllProducts();
       
    }

    //bisogna creare un'altra funzione che richiama sempre la stessa api ma con un booleano diverso
    //a seconda che arriviamo su questa pagina da navbar o da rentform
    
  },[]);

  // useEffect(()=>{

  //  console.log(formData);

  // },[])
    
  return (obj ? (<div className="product">
     <div className="card m-3" style={{width: "18rem"}}>

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
  <a href="#" className="btn btn-primary">Rent this product</a>
</div>
</div>
<a href="#" className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); window.location.reload()})}>Disable Filters</a>
  </div> ) : (<div className='product'>{toInsert.map((product) =>
    
    <div className="card m-3" style={{width: "18rem"}}>

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
    <a href="#" className="btn btn-primary">Rent this product</a>
  </div>
</div>
  
    )}
    <a href="#" className="btn btn-primary" onClick={(()=>{sessionStorage.removeItem('form_obj'); history.push('/products')})}>Disable Filters</a>

    </div>));
}

export default Products;