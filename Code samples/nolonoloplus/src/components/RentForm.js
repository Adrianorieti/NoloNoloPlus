import React, { useEffect, useState } from "react";
import RangeDaysPicker from "./RangeDaysPicker"
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm(props) {

  let history = useHistory();
  const [cat, setCat] = useState([]);

  function checkInput() {

    let form_obj = ``;
    const select = document.getElementById('form-sel');
    let bikeType;
    bikeType = select.value;
    let start = document.querySelector("#fromDate").innerHTML;
    let end = document.querySelector("#toDate").innerHTML;
    console.log(start);
    if (start == null || end == null || start == 'undefined' || end == 'undefined') {
      document.getElementById('date-err').innerHTML = "Please insert a valid date";
      return;
    }
    let today = new Date();
    let toCompare = new Date(start);
    console.log(toCompare.getTime());
    console.log(today.getTime());
    if ((toCompare.getDate() == today.getDate() &&
      toCompare.getMonth() == today.getMonth() &&
      toCompare.getFullYear() == today.getFullYear()) || toCompare.getTime() > today.getTime()) {
      form_obj += `{
        "name": "${bikeType}",
        "startingDate": "${start}",
        "endingDate": "${end}"
       }`;
      sessionStorage.setItem('form_obj', form_obj);
      let token = sessionStorage.getItem('token');
      if (token) {
        history.push('/rental');
      }
      else {
        history.push('/hypothesis');
      }
    }
    else if (toCompare.getTime() < today.getTime()) {

      document.getElementById('date-err').innerHTML = "Please insert a valid date";
      return;
    }

  }

  useEffect(async () => {

    let res = [];
    async function getCategories() {
      let url = "http://localhost:8001/api/categories/";
      try {
        let response = await fetch(url);
        res = await response.json();
        setCat(res);
      } catch (error) {
        console.log(error);
      }
    }

    await getCategories();

    props.focusToParent(false);
    let parameter = props.location.state;
    let index;
    if (parameter != null || parameter != undefined) {
      console.log(parameter);

      for (index in res) {
        if (parameter.data === res[index].name) {
          break;
        }
      }

      document.getElementById('form-sel').selectedIndex = index;
    }
  }, [])

  return (
    <main className="App-rent ">
      <div className="container App-rent">
        <div classname="row container-properties">
          <div classname="col-md-12">
            <form className="rentForm" >
              <div id="formTitle">
                <h1>Start renting</h1>
                <p className="step">Step 1</p>
              </div>
              <div id="selectProduct">
                <p><h5>Pick the Best Bike for You...</h5></p>
                {(() => {
                  let options = [];
                  for (let category of cat) {
                    let newOption = <option id={category.name} name="products" className="form-select" type="radio" value={category.name} >{category.name}</option>
                    options.push(newOption);
                  }
                  return (
                    <select id="form-sel" className="form-select" aria-label="Default select example">
                      {options}
                    </select>
                  );
                })()}
              </div>
              <div className="step">Step 2</div>
              <fieldset aria-required="true">
                <div>
                  <legend><h5>Choose a date</h5></legend>
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