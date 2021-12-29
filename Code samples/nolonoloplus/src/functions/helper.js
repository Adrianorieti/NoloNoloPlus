import React from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import specialBike from '../images/specialBike.jpeg';
import cityBike from '../images/cityBike.jpg';

function chooseImage(name)
{
    if (name === "Electric S_300") {
        return (
          <img src={electricBike} className="card-img-top" alt="Foto del prodotto" /> 
          )
      } else if (name === "Mountain Bike") {
        return (
          <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      } else if(name == "City Bike"){
        return (
          <img src={cityBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(name == "Special Bike"){
        return (
          <img src={specialBike} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
      else if(name == "Scooter"){
        return (
          <img src={scooter} className="card-img-top" alt="Foto del prodotto" /> 
        )
      }
}

export  {chooseImage};


