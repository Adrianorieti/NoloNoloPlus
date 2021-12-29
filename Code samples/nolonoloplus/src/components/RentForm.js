import React from "react";
import RangeDaysPicker from "./RangeDaysPicker"
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm({ queryToParent }) {

  let history = useHistory();

  function checkInput() {

    let form_obj = ``;
    const radioInput = document.querySelector("input[name='products']:checked");
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
   if(token)
    history.push('/rental');
   else
    history.push('/hypothesis')
    }
    else {
      alert("Please select a field");
    }
  }

  return (
    <div className="App-rent">
      <main>
        <form className="rentForm" >
          <fieldset id="Bikes_Types" aria-required="true">
            <legend>Bikes types</legend>
            <section className="mb-3 form-check">
              <div>
                <input id="Mountain-Bike" name="products" className="form-select" type="radio" value="City Bike" ></input>
                <label htmlFor="City-Bike" className="form-label">City Bike</label>
              </div>
              <div>
                <input id="Mountain-Bike" name="products" className="form-select" type="radio" value="Mountain Bike" ></input>
                <label htmlFor="Mountain-Bike" className="form-label">Mountain Bike</label>
              </div>
              <div>
                <input id="City-Bike" name="products" className="form-select" type="radio" value="Scooter"></input>
                <label htmlFor="Scooter" className="form-label">Scooter</label>
              </div>
              <div>
                <input id="Electric-Bike" name="products" className="form-select" type="radio" value="Electric S_300" ></input>
                <label htmlFor="Electric-Bike" className="form-label">Electric Bike</label>
              </div>
              <div>
                <input id="Electric-Bike" name="products" className="form-select" type="radio" value="Special Bike" ></input>
                <label htmlFor="Special-Bike" className="form-label">Special Bike</label>
              </div>
            </section>
          </fieldset>

          <fieldset aria-required="true">
            <legend>Renting dates inputs</legend>
            <section className="mb-3">
              <RangeDaysPicker />
            </section>
          </fieldset>
          <button id="rentFormButton" type="button" className="btn btn-success" onClick={checkInput}>Click to submit</button>
        </form>
      </main>
      </div>
  );
}

export default RentForm;