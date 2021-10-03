import React, { useState } from "react";
import Datepicker from 'react-ada-keyboard-accessible-datepicker'
//yarn add react-ada-keyboard-accessible-datepicker

import RangeDaysPicker from "./RangeDaysPicker"

import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';



function RentForm() {

  function submit() {
    let form_obj = ``;
    //prendiamo l'elemento selezionato tra i vari radio button, e lo inseriamo nel json che manderemo al server.
    const radioInput = document.querySelector("input[name='products']:checked");
    let bikeType = 'all';
    if (radioInput) {
      bikeType = radioInput.value;
    }
    let startingDate = document.querySelector("#fromDate").innerHTML;
    let endingDate = document.querySelector("#toDate").innerHTML;
    form_obj += `{
      "type": "${bikeType}",
      "startingDate": "${startingDate}",
      "endingDate": "${endingDate}"
     }`;
    alert(form_obj);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    //DA CAMBIARE QUESTE COSE
    xhr.onload = function () {
      if (xhr.status == 200) {
        //in questo caso bisogna reindirizzare alla pagina con tutte le immagini dei prodotti scelti.
      }
      else if (xhr.status == 500) {
        console.log("La mail esiste già");
        document.getElementById('mail-error').innerHTML = "Mail already in use BOOMER";
      }
    }
    xhr.onerror = function () {
      console.log(this.response);
      console.log("Error ....");
    }

    xhr.send(form_obj);
  }

  return (
    <main>
      <form className="rentForm" >
        <fieldset id="Bikes_Types" aria-required="true">
          <legend>Bikes types</legend>
          <section className="mb-3 form-check">
            <div>
              <input id="Mountain-Bike" name="products" className="form-select" type="radio" value="Mountain Bike" ></input>
              <label htmlFor="Mountain-Bike" className="form-label">Mountain Bike</label>
            </div>
            <div>
              <input id="City-Bike" name="products" className="form-select" type="radio" value="City Bike"></input>
              <label htmlFor="City-Bike" className="form-label">City Bike</label>
            </div>
            <div>
              <input id="Electric-Bike" name="products" className="form-select" type="radio" value="Electric Bike" ></input>
              <label htmlFor="Electric-Bike" className="form-label">Electric Bike</label>
            </div>
          </section>
        </fieldset>
        <fieldset aria-required="true">
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <RangeDaysPicker />
          </section>
        </fieldset>
        <button id="rentFormButton" type="button" className="btn btn-success" onClick={submit}>Click to submit</button>
      </form>
    </main>

  );
}

export default RentForm;