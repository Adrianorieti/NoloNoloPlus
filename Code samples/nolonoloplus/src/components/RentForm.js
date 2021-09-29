import React, { useState } from "react";
import Datepicker from 'react-ada-keyboard-accessible-datepicker'
//yarn add react-ada-keyboard-accessible-datepicker

import RangeDaysPicker from "./RangeDaysPicker"


function RentForm() {
  //inizializziamo constanti e states
  const customInputBox = <input id="Custom-Box" ></input>
  let form_obj = ``;//questo è il json contente le informazioni del nostro form.
  const [infoLabel, setinfoLabel] = useState('Starting Date'); //state che serve per cambiare il label al datePicker
  let datePicker;
  let rentFormButton;


  window.onload = () => {
    //Selezioniamo gli elementi che ci servono dall'html e aggiungiamo eventListener al bottone di rent
    rentFormButton = document.querySelector("#rentFormButton");
    rentFormButton.addEventListener('click', toDate);
    datePicker = document.querySelector("#Custom-Box");
  };

  function toDate() {
    //prendiamo l'elemento selezionato tra i vari radio button, e lo inseriamo nel json che manderemo al server.
    const radioInput = document.querySelector("input[name='products']:checked");
    let bikeType = 'all';
    if (radioInput) {
      bikeType = radioInput.value;
    }
    form_obj += `{
      "type": "${bikeType}",`;
    //ora prendiamo il form con i radio button, lo mettiamo hidden e sveliamo il form con il date picker
    document.querySelector("#Bikes_Types").setAttribute("hidden", "true");
    document.querySelector("#Renting_Dates").removeAttribute("hidden");
    //infine cambiamo la funzione quando viene cliccato il bottone
    rentFormButton.innerHTML = "Click to go choosing the ending date";
    rentFormButton.removeEventListener('click', toDate);
    rentFormButton.addEventListener('click', toSubmit);
    datePicker.focus();
  }

  function toSubmit() {
    //se è stata inserita una data valida nel datePicker la aggiungiamo al JSON
    if (datePicker.value) {
      form_obj += `
        "startingDate": "${datePicker.value}",`;
      rentFormButton.removeEventListener("click", toSubmit);
      rentFormButton.addEventListener('click', submit);
      rentFormButton.innerHTML = 'click to submit!';
      //cambiamo label al datePicker, perchè ora dobbiamo scegliere l'ending date.
      setinfoLabel("Ending Date");
      datePicker.focus();
    }
    else {
      //Sennò creiamo un error-message label, built-in del datePicker.
      document.querySelector("#error-message").innerHTML = "Please enter a date!";
      alert("You didn't enter a valid data, please try again!");
      datePicker.focus();

    }
  }

  function submit() {
    //se è stata inserita una data valida nel datePicker la aggiungiamo al JSON, e poi mandiamo il tutto
    if (datePicker.value) {
      form_obj += `
        "endingDate": "${datePicker.value}"
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
    else {
      //Sennò creiamo un error-message label, built-in del datePicker.
      document.querySelector("#error-message").innerHTML = "Please enter a date!";
    }
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
        <fieldset id="Renting_Dates" hidden='true' aria-required="true">
          <legend>Renting dates inputs</legend>
          <section className="mb-3" >
            <Datepicker
              dateFormat={"mm dd, yyyy"}
              minDate={"today"}
              themeColor={"rgb(99, 218, 99)"}
              customInputBox={customInputBox}
              inputBoxLabel={infoLabel}
            />
          </section>
        </fieldset>
        <fieldset aria-required="true">
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <RangeDaysPicker />
          </section>
        </fieldset>
        <button id="rentFormButton" type="button" className="btn btn-success">Click to go choosing the starting date</button>
      </form>
    </main>

  );
}

export default RentForm;