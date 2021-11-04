import React from "react";
import RangeDaysPicker from "./RangeDaysPicker"
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm({ queryToParent }) {

  let history = useHistory();

  function submit() {
    // prendiamo i dati che ci servono

    let form_obj = ``;
    //TO-DO se qualcuno  dei campi non è selezionato allora c'è un errore da mostrare
    //perchè sono richiesti 
    const radioInput = document.querySelector("input[name='products']:checked");
    let bikeType;
    if (radioInput) {
      bikeType = radioInput.value;
      let startingDate = document.querySelector("#fromDate").innerHTML;
      let endingDate = document.querySelector("#toDate").innerHTML;
      form_obj += `{
    "name": "${bikeType}",
    "startingDate": "${startingDate}",
    "endingDate": "${endingDate}"
   }`;
   sessionStorage.setItem('form_obj', form_obj);
   //passiamo il testimone a Products
   history.push('/products');
    }
    else {
      alert("Please select a field");
    }
  }

  // useEffect(() =>
  // {
  //   sessionStorage.removeItem('form_obj');
  // })

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
          <button id="rentFormButton" type="button" className="btn btn-success" onClick={submit}>Click to submit</button>
        </form>
      </main>
      </div>
  );
}

export default RentForm;