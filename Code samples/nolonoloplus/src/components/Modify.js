import React, { useEffect, useState } from 'react';
import './style/Modify.css';

function Modify(props)
{

    const [products, setProducts] = useState([]);
    const[select, setSelect] = useState('');


    function sendModify()
    {
      let oldStart = new Date(props.target.start);
      let oldEnd = new Date(props.target.end);
      let oldProduct = props.target.product;
      let email = props.target.usermail // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
      let employee = props.target.employee;
      let product = document.getElementById('form-sel').value; // nome del prodotto
      let start = new Date(document.getElementById('start').value);
      let end = new Date(document.getElementById('end').value);
      // devo comunque mandare i vecchi dati

 
  if((start != "" && end != "") && (start.getTime() <= end.getTime()) )
  {
    
    let obj = `{
      "user": "${email}", 
      "employee": "${employee}",
        "product": "${product}",
        "oldStart": "${oldStart}",
        "oldEnd": "${oldEnd}",
        "start": "${start}",
        "end": "${end}"
      }`;
      
     // fare chiamata api e messaggio di successfuly
    }else
    {
      document.getElementById('error').innerHTML = "Please insert field correctly";
    }
}


    useEffect(() => {
        console.log(props);
        async function getProducts() {
            let url = "http://localhost:8001/api/categories/";
            try {
              let response = await fetch(url);
              let res = await response.json();
              setProducts(products.concat(res));
            } catch (error) {
              console.log(error);
            }
          }
          getProducts();
        },[])

   


    return(
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
        </div>
    )
}



export default Modify;