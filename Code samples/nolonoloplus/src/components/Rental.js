import React from 'react';
import electricBike from '../images/electricBike.jpg';
import mountainBike from '../images/mountainBike.jpg';
import scooter from '../images/scooter.jpg';
import specialBike from '../images/specialBike.jpeg';
import cityBike from '../images/cityBike.jpg';
import { useHistory } from "react-router";
import './style/Rental.css';

function Rental(props) {
  let history = useHistory();

  function sendRent() {

    const token = JSON.parse(sessionStorage.getItem('token'));
    console.log(props.productName);
    let form_obj = `{
                "name": "${props.productName}", 
                "startingDate": "${props.startDate}",
                "endingDate": "${props.endDate}",
                "expense": "${props.price}"
               }`;

    const options = {
      method: 'POST',
      headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
      body: form_obj
    };

    let url = 'http://localhost:8001/api/rental/addRent';
    fetch(url, options)
      .then(response => {
        if (response.status == 200) {
          console.log("è andato tutto bene ");
          history.push('/personalpage');
        } else { console.log(response.status) }
      })
      .catch(error => {
        console.log(error);
      });

  }


  function removeFromAll(start, end, name) {
    const token = JSON.parse(sessionStorage.getItem('token'));
    let obj = `{
            "startingDate": "${start}",
            "endingDate": "${end}",
            "prodName": "${name}"
        }`;
    console.log(obj);
    const options = {
      method: 'POST',
      headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
      body: obj
    };
    const url = 'http://localhost:8001/api/customer/removeReservation';
    fetch(url, options)
      .then(response => {
        if (response.status === 200) {
          console.log("eliminazione avvenuta con successo");
          sendRent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function smista() {
    if (props.oldStartDate != null) {
      removeFromAll(props.oldStartDate, props.oldEndDate, props.oldProdName);
    }
    else {
      sendRent();
    }
  }

  return (<div className="text-center m-3 rental">

    <div id="rentalPic">
      {(() => { // image div
        if (props.categoryName === "Electric S_300") {
          return (
            <img src={electricBike} className="card-img-top" alt="Foto del prodotto" />
          )
        } else if (props.categoryName === "Mountain Bike") {
          return (
            <img src={mountainBike} className="card-img-top" alt="Foto del prodotto" />
          )
        } else if (props.categoryName == "City Bike") {
          return (
            <img src={cityBike} className="card-img-top" alt="Foto del prodotto" />
          )
        }
        else if (props.categoryName == "Special Bike") {
          return (
            <img src={specialBike} className="card-img-top" alt="Foto del prodotto" />
          )
        }
        else if (props.categoryName == "Scooter") {
          return (
            <img src={scooter} className="card-img-top" alt="Foto del prodotto" />
          )
        }
      })()} </div>
    {/* content div */}
    <div className="text-center rentalContent">
      <div>
        <h3>Your rental summary:</h3>
        <p>Product : {props.categoryName}</p>
        <p>Total price : {props.price}</p>
        <p>{props.description}</p>
        <h4>Period :</h4>
        <p>Start : {props.startDate}</p>
        <p>End : {props.endDate}</p>
        <div className="d-flex rentbuttons">

          <button type="button" class="btn btn-success" onClick={smista}>Complete</button>
          <p>or</p>
          <button type="button" class="btn btn-danger" onClick={(() => { history.push('/') })}>Make a new Rent</button>
        </div>

      </div>
    </div>
  </div>
  );
}

export default Rental;