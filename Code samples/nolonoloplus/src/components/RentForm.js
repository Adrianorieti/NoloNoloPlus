import React from "react";
import Datepicker from 'react-ada-keyboard-accessible-datepicker'
//yarn add react-ada-keyboard-accessible-datepicker

function RentForm() {
  let form_obj = ``;//questo è il json contente le informazioni del nostro form.

  function submit() {
    const datePicker = document.querySelector("#Custom-Box");
    if (datePicker.value) {
      form_obj += `
      "endingDate": "${datePicker.value}"
      }`;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/register", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      //DA CAMBIARE QUESTE COSE
      xhr.onload = function () {
        if (xhr.status == 200) {
          console.log("Registrazione avvenuta con successo.");
          //reindirizzare alla pagina utente. 
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
  }

  function toSubmit() {
    const datePicker = document.querySelector("#Custom-Box");
    if (datePicker.value) {
      form_obj += `
      "startingDate": "${datePicker.value}"`;
      datePicker.value = "";
      const button = document.querySelector("#rentFormButton");
      button.removeEventListener("click", toSubmit);
      button.addEventListener('click', submit);
      button.innerHTML = 'click to submit!';
    }
    else {
      //fare qualcosa se non selezione una data!
    }
  }

  function toDate() {
    //prendiamo l'elemento selezionato tra i vari radio button, e lo inseriamo nel json che manderemo al server.
    const radioInput = document.querySelector("input[name='products']:checked");
    let bikeType;
    if (radioInput) {
      bikeType = radioInput.value;
    }
    else {
      bikeType = 'all'
    }
    form_obj += `{
      "type": "${bikeType}"`;
    //ora prendiamo il form con i radio button, lo mettiamo hidden e sveliamo il form con il date picker
    document.querySelector("#Bikes_Types").setAttribute("hidden", "true");
    document.querySelector("#Renting_Dates").removeAttribute("hidden");
    //infine cambiamo la funzione quando viene cliccato il bottone
    const button = document.querySelector("#rentFormButton");
    button.innerHTML = "Click to go choosing the ending date";
    //FIXARE
    button.removeEventListener('click', toDate);//questo non rimuove le cose fatte. Da studiare la parte di Hooks!
    button.addEventListener('click', toSubmit);
  }

  const customInputBox = <input id="Custom-Box" ></input>
  return (
    <main>
      <form className="rentForm" >
        <fieldset id="Bikes_Types">
          <legend>Bikes types</legend>
          <section className="mb-3 form-check">
            <div>
              <input id="Mountain-Bike" name="products" className="form-select" type="radio" value="Mountain Bike" aria-required="true" ></input>
              <label for="Mountain-Bike" className="form-label">Mountain Bike</label>
            </div>
            <div>
              <input id="City-Bike" name="products" className="form-select" type="radio" value="City Bike" aria-required="true" ></input>
              <label for="City-Bike" className="form-label">City Bike</label>
            </div>
            <div>
              <input id="Electric-Bike" name="products" className="form-select" type="radio" value="Electric Bike" aria-required="true"></input>
              <label for="Electric-Bike" className="form-label">Electric Bike</label>
            </div>
          </section>
        </fieldset>
        <fieldset id="Renting_Dates" hidden='true'>
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <Datepicker
              dateFormat={"mm dd, yyyy"}
              minDate={"today"}
              themeColor={"rgb(99, 218, 99)"}
              customInputBox={customInputBox}
            />
          </section>
        </fieldset>
        <button id="rentFormButton" type="button" className="btn btn-success" onClick={toDate} >Click to go choosing the starting date</button>
      </form>
    </main>

  );
}

export default RentForm;