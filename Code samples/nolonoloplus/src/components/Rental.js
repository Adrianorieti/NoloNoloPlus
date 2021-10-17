import React from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import specialBike from '../images/specialBike.jpeg';
import cityBike from '../images/cityBike.jpg';
import {useEffect} from 'react';
import { useHistory } from "react-router";



function Rental(props)
{
    let history = useHistory();

    function sendRent(){
      
            //checko se c'è disponibilità
            let form_obj = `{
                "name": "${props.prodName}", 
                "startingDate": "${props.startDate}",
                "endingDate": "${props.endDate}"
               }`;
        //faccio una fetch al server
    }

    return(<div className="text-center m-3 rental">

        <div id="rentalPic">  
        {(() => { // image div
      if (props.prodName === "Electric S_300") {
        return (
          <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
      } else if (props.prodName === "Mountain Bike") {
        return (
          <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      } else if(props.prodName == "City Bike"){
        return (
          <img src={cityBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(props.prodName == "Special Bike"){
        return (
          <img src={specialBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(props.prodName == "Scooter"){
        return (
          <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
    })()} </div>
    {/* content div */}
    <div className="text-center rentalContent"> 
    <div>
        <h3>Your rental summary:</h3>
        <p>Product : {props.prodName}</p>
        <p>Total price : {props.price}</p>
        <p>{props.description}</p>
        <h4>Period :</h4>
        <p>Start : {props.startDate}</p>
        <p>End : {props.endDate}</p>
   <div className="d-flex rentbuttons">

  <button type="button" class="btn btn-success" onClick={sendRent}>Complete</button>
  <p>or</p>
  <button  type="button" class="btn btn-danger" onClick={(() => { history.push('/')})}>Make a new Rent</button>
   </div>
  
</div>
</div>
        </div>
      );
}

export default Rental;