import React from 'react';
import {chooseImage} from '../functions/helper';
import { useHistory } from "react-router";


function Product(props)
{
    const history = useHistory();

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
}



export default Product;