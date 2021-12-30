import React from 'react';
import {chooseImage} from '../functions/helper';
import { useHistory } from "react-router";


function Product(props)
{
    const history = useHistory();
 if(Array.isArray(props.products))
   {

     return(
         props.products.map((product) => 
         {
             return(
                 <div className="card m-3" style={{width: "18rem"}}>
                {chooseImage(product.name)}
                <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Price per day {product.price}$</p>
                {props.token ? <button className="btn btn-primary" onClick={(()=>{history.push('/')})}>Rent this product</button> :
                <button className="btn btn-primary" onClick={(()=>{history.push('/')})}>Make a rental hypothesis</button>}
            </div>
            </div>
            )})
            )
    }else
    {
        return(
            <div className="card m-3" style={{width: "18rem"}}>
            {chooseImage(props.products.name)}
            <div className="card-body">
            <h5 className="card-title">{props.products.name}</h5>
            <p className="card-text">{props.products.description}</p>
            <p className="card-text">Estimated price {props.price}$</p>
        </div>
        </div>
        )
    }
}



export default Product;