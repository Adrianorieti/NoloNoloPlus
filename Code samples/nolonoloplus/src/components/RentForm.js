import React from "react";
import RangeDaysPicker from "./RangeDaysPicker"
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm({ queryToParent }) {

  let history = useHistory();

  function checkInput() {

    let form_obj = ``;
    const radioInput = document.querySelector('#Mountain-Bike option:checked').value
    console.log(radioInput);
    let bikeType;
    if (radioInput) {
      bikeType = radioInput.value;
      let start = document.querySelector("#fromDate").innerHTML;
      let end = document.querySelector("#toDate").innerHTML;
      form_obj += `{
    "name": "${bikeType}",
    "startingDate": "${start}",
    "endingDate": "${end}"
   }`;
      sessionStorage.setItem('form_obj', form_obj);
      let token = sessionStorage.getItem('token');
      if (token)
        history.push('/rental');
      else
        history.push('/hypothesis')
    }
    else {
      alert("Please select a field");
    }
  }

  return (
    <main className="App-rent container-properties">
      <div className="container">
        <div classname="row">
          <div classname="col-md-12 rentForm">
            <form>
              
              <fieldset id="Bikes_Types" aria-required="true">
                <legend>Pick the Best Bike for You...</legend>
                <section className="mb-3">
                  <div className="input-group justify-content-center">
                    <select name="products" id="Mountain-Bike" aria-label="Select a bike">
                      
                      <option selected></option>
                      <option value="City Bike">City Bike</option>
                      <option value="Mountain Bike">Mountain Bike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Scooter">Electric-Bike</option>
                      <option value="Scooter">Special-Bike</option>
                    </select>
                  </div>
                  <hr></hr>
                </section>
              </fieldset>

              <fieldset aria-required="true">
                <legend>Choose a date</legend>
                <section className="mb-3">
                  <RangeDaysPicker />
                </section>
              </fieldset>

              <button id="rentFormButton" type="button" className="btn btn-success" onClick={checkInput}><h3>Click to submit</h3></button>
            </form>
          </div>
        </div>
      </div>
    </main>

  );
}

export default RentForm;