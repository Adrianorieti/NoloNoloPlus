import React from 'react';
import {chooseImage} from '../functions/helper';
import { useHistory } from "react-router";


function Product(props)
{
    const history = useHistory();
 if(Array.isArray(props.products)) // caso in cui renderizzo la pagina dei prodotti
   {

     return(
         props.products.map((product) => 
         {
             return(
                 <div className="card m-3" style={{width: "18rem", border: 'none'}}>
                {chooseImage(product.name)}
                <div className="card-body" style={{backgroundColor: '#e5f5c6'}}>
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Price per day {product.price}$<span><i className="fa fa-info-circle"></i></span></p>
                {props.token ? <button className="btn btn-primary" onClick={(()=>{props.focusToParent(true);history.push({
                pathname: '/',
                state: {
                    data: product.name,
                },
            })
        })}>Rent this product</button> :
                <button className="btn btn-primary" onClick={(()=>{props.focusToParent(true);history.push({
                    pathname: '/',
                    state: {
                        data: product.name,
                    },
                })})}>Make a rental hypothesis</button>}
            </div>
            </div>
            )})
            )
    }else // caso in cui renderizzo una categoria, qui posso mettere il token condizionale
    { // per renderizzarlo in due modi, così copro l'ipotesi e il noleggio vero e proprio, i due pulsanti dovranno
        return( // rimandare al sommario del rental vero e proprio che è un'altra pagina oppure indietro se non si vuole + fare
            <div className="card m-3" style={{width: "18rem"}}> 
            {chooseImage(props.products.name)}
            <div className="card-body">
            <h5 className="card-title">{props.products.name}</h5>
            <p className="card-text">{props.products.description}</p>
            <p className="card-text">Estimated price {props.price}$<span><i className="fa fa-info-circle"></i></span>   </p>
        </div>
        </div>
        )// quando rimando indietro vabè nessun problema, magari elimino form_obj dal session storage
    }// quando invece vado al rental (che è un sommario dove mi si chiede se voglio confermare o meno o tornare indietro) io devo cmq portarmi dietro la categoria perchè dovrò 
}// farne il display del sommario, ma anche il prodotto singolo ! perchè cmq è su quello che chiamerò l'api della prenotazione
// se la prenotazione non può avvenire perchè qualcuno ha fregato quello specifico prodotto, si dice di ricominciare da capo il procedimento perchè
// non è + disponibile per quelle date e il prezzo potrebbe variare quindi deve riconfermare

export default Product;