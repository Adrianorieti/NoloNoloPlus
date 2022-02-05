import React, { useEffect, useState } from 'react';


function Modify(props)
{

    const [products, setProducts] = useState([]);
    const[select, setSelect] = useState('');
    useEffect(() => {
        console.log("qui dentro");
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
            <select id="form-sel" className="form-select" aria-label="Default select example">
              {options}
            </select>
            <h5>Choose a new period</h5>
            <div className="input-group mb-3 text-center justify-content-center">
        <label className="input-group-text" for="start"><b>Start</b></label>
        <input type="date" id="start" />
        </div>
        <div className="input-group mb-3 text-center  justify-content-center ">
        <label className="input-group-text" for="end"><b>End</b></label>
        <input type="date" id="end" />
        </div>
            </div>
          );
       })()}</p>
        </div>
    )
}



export default Modify;