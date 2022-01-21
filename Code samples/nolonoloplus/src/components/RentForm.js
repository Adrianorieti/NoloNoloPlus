import React, { useEffect } from "react";
import RangeDaysPicker from "./RangeDaysPicker"
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm( props ) {

  let history = useHistory();

  console.log("LOCAAAATION", props.location);

  function checkInput() {

    let form_obj = ``;
    const select = document.getElementById('form-sel');
    let bikeType;
    bikeType = select.value;
    let start = document.querySelector("#fromDate").innerHTML;
    let end = document.querySelector("#toDate").innerHTML;
    let today = new Date();
    let toCompare = new Date(start);
  
    if(toCompare.getTime() < today.getTime())
    {
      document.getElementById('date-err').innerHTML ="Please insert a valid date";
    }
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

  useEffect(() => {

    props.focusToParent(false);
    let parameter = props.location.state;
    let index=0;
    if(parameter != null || parameter != undefined)
    {
      console.log(parameter);

      switch (parameter.data) {
        case 'Mountain Bike':
          index=1;
          break;
        case 'Scooter':
          index=2;
          break;
        case 'Electric S_300':
          index=3;
          break;
        case 'Special Bike':
          index=4;
          break;
          }
          
      document.getElementById('form-sel').selectedIndex=index;
    }
  },[])

  return (
    <main className="App-rent ">
      <div className="container App-rent">
        <div classname="row container-properties">
          <div classname="col-md-12">
            <form className="rentForm" >
{/* 
              <fieldset id="Bikes_Types" aria-required="true">
                <legend>Bikes types</legend>
                <hr></hr>
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
              </fieldset> */}
              <div id="formTitle">
              <h3>Start a rental</h3>
              <p className="step">Step 1</p>
              </div>
              
                <div id="selectProduct">
                  <p><b>Choose a product</b></p>
              <select id="form-sel" className="form-select" aria-label="Default select example">
              <option  id="City-Bike" name="products" className="form-select" type="radio" value="City Bike">City Bike</option>
              <option id="Mountain-Bike" name="products" className="form-select" type="radio" value="Mountain Bike" >Mountain Bike</option>
              <option id="Scooter" name="products" className="form-select" type="radio" value="Scooter">Scooter</option>
              <option  id="Electric-Bike" name="products" className="form-select" type="radio" value="Electric S_300">Electric Bike</option>
              <option  id="Special-Bike" name="products" className="form-select" type="radio" value="Special Bike">Special Bike</option>
            </select>
            </div>
            <div className="step">Step 2</div>
              <fieldset aria-required="true">
              <div>
                <legend>Select a date</legend>
                </div>
                <hr></hr>
                <section className="mb-3">
                  <RangeDaysPicker />
                </section>
              </fieldset>
                <span id="date-err"></span>
              <button id="rentFormButton" type="button" className="btn btn-success" onClick={checkInput}>Click to submit</button>
            </form>
          </div>
        </div>
         </div>
      </main>
     
  );
}

export default RentForm;