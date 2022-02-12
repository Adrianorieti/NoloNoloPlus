import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";

import './style/Modify.css';
function Modify(props)
{
    const [oldProd, setOldProd] = useState('');
    const [newProd, setNewProd] = useState('');
    const [products, setProducts] = useState([]);
    const[succesful, setSuccesful] = useState(false);
    const[error, setError]= useState(false);
    let history = useHistory();
    
   

  // mi salvo il vecchio prodotto
    async function getOldProduct(old){
      let res;
      let url = `http://site202145.tw.cs.unibo.it/api/products/${old}`;
      try {
        let response = await fetch(url);
        res = await response.json();
        console.log("res", res.product[0]);
        setOldProd(res.product[0]);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    }

    function sendModify()
    {
      let oldStart = new Date(props.target.start);
      let oldEnd = new Date(props.target.end);
      let email = props.target.usermail // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
      let employee = props.target.employee;
      let category = document.getElementById('form-sel').value; // nome del prodotto
      let start = new Date(document.getElementById('start').value);
      let end = new Date(document.getElementById('end').value);
      let today = new Date();
      // devo comunque mandare i vecchi dati

     
    
  if((start != "" && end != "") && (start.getTime() <= end.getTime()) && (start.getTime() >= today.getTime()) )
  {
      //CASO 1, il cliente non vuole cambiare categoria
    if(category === oldProd.type)
    {
      let obj = `{
        "user": "${email}", 
        "employee": "${employee}",
          "product": "${oldProd.name}",
          "oldStart": "${oldStart}",
          "oldEnd": "${oldEnd}",
          "start": "${start}",
          "end": "${end}"
        }`;

        const options = {
          method: 'PATCH',
          headers: new Headers({ 'Content-type': 'application/json' }),
          body: obj
      };
       
        let url = `http://site202145.tw.cs.unibo.it/api/rental/${oldProd.name}/modify`;
        fetch(url, options)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            }).then((data) =>{
                console.log("Tutto ok ???");
                setSuccesful(true);
                history.push('/personalpage');
        }).catch(error => {
            console.log(error.message);
            setError(true);

          });
          
    }else{

      // CASO 2: il cliente vuole cambiare categoria
      let tokn = JSON.parse(sessionStorage.getItem('token'));
            const options = {
                method: 'GET',
                headers: new Headers({'Authorization': `Bearer ${tokn}` })
              };
            const url = `http://site202145.tw.cs.unibo.it/api/categories/${category}/available/?start=${start}&end=${end}`;
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                }).then((data) =>{
             
              // Dopo aver controllato che ci siano prodotti disponibili dentro la categoria
              // procediamo al cambio della prenotazione
               let obj = `{
                "user": "${email}", 
                "employee": "${employee}",
                  "product": "${data.product.name}",
                  "oldStart": "${oldStart}",
                  "oldEnd": "${oldEnd}",
                  "start": "${start}",
                  "end": "${end}"
                }`;
           
                const options2 = {
                  method: 'PATCH',
                  headers: new Headers({ 'Content-type': 'application/json' }),
                  body: obj
              };

                let url = `http://site202145.tw.cs.unibo.it/api/rental/${oldProd.name}/modify`;
              fetch(url, options2)
              .then(response => {
                  if (response.status === 200) {
                      return response.json();
                  }
                  }).then((data) =>{
                      console.log("Tutto ok ???");
                      setSuccesful(true);
                      history.push('/');
              }).catch(error => {
                  console.log(error.message);
                  setError(true);

                });
                

            }).catch(error => {
                console.log(error.message);
                setError(true);
                return null;
              });
    }
    
     // fare chiamata api e messaggio di successfuly
    }else
    {
      document.getElementById('error').innerHTML = "Please insert field correctly";
    }
}


    useEffect(() => {
        async function getProducts() {
            let url = "http://site202145.tw.cs.unibo.it/api/categories/";
            try {
              let response = await fetch(url);
              let res = await response.json();
              setProducts(products.concat(res));
            } catch (error) {
              console.log(error);
            }
          }
          getProducts();
          let oldProduct = props.target.product;
          getOldProduct(oldProduct);

        },[])

   


    return(<div>
      { error ?  <div id="response"><b><h3>Service temporarily unavailable</h3><p>Please try again later</p></b></div> : ( succesful ? <div id="response"><b><h3>Succesful operation</h3></b></div> : (
        <div>
       <p>{(() => {
            let options = [];
            for (let x in products) {
              let newOption = <option id={products[x].name} name="products" className="form-select" type="radio" value={products[x].name} >{products[x].name}</option>
              options.push(newOption);
            }
        return (<div className='d-flex flex-column text-center gap-2  justify-content-center'>
            <h3>Modify reservation</h3>
            <h5><label for="form-sel">Choose a new product </label></h5>
            <div className='catCont'>
            <select id="form-sel" className="form-select cat text-center" aria-label="Default select example">
              {options}
            </select>
            </div>
            <h5>Choose a new period</h5>
            <div className="input-group mb-3 text-center justify-content-center margin-2">
        <label className="input-group-text" for="start"><b>Start</b></label>
        <input type="date" id="start" />
        </div>
        <div className="input-group mb-3 text-center  justify-content-center ">
        <label className="input-group-text" for="end"><b>End</b></label>
        <input type="date" id="end" />
        </div>
        <span id="error"></span>
        <div className='buttons' >
        <button type="button" className="btn btn-lg btn-primary m-1 " onClick={sendModify}>Send</button>
        </div>
            </div>
          );
       })()}</p>
        </div> ))}
        </div>
    )
}



export default Modify;