import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import './style/RentForm.css';

function RentForm(props) {

  let history = useHistory();
  const [cat, setCat] = useState([]);

  useEffect(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("end").setAttribute("min", today);
    document.getElementById("start").setAttribute("min", today);
  })

  function checkInput(event) {
    event.preventDefault();
    let form_obj = ``;
    const select = document.getElementById('form-sel');
    let bikeType;
    bikeType = select.value;
    let start = new Date(document.querySelector("#start").value);
    let end = new Date(document.querySelector("#end").value);
    // console.log("start", start);

    let today = new Date();
    // console.log(today.getTime());
    // console.log("toDay", today);
    // console.log("start", start);
    if (start.getTime() > end.getTime()) {
      let temp = new Date(start);
      start = new Date(end);
      end = new Date(temp);
    }
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

  useEffect(async () => {

    let res = [];
    async function getCategories() {
      let url = "http://site202145.tw.cs.unibo.it/api/categories/";
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
    <main className="App-rent rentform">
      <form onSubmit={checkInput}>
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
            <legend><h5>Choose a period</h5></legend>
          </div>

          <hr></hr>
          <section className="mb-3">
            {/* <RangeDaysPicker /> */}
            <div containerName="row">
              <div>
                <label for="start">Start:</label>
                <input type="date" id="start" name="start" required></input>
              </div>
              <div>
                <label for="end">End:</label>
                <input type="date" id="end" name="end" required></input>
              </div>
            </div>
          </section>

        </fieldset>
        <span id="date-err"></span>
        <button id="rentFormButton" type="submit" className="btn btn-success btn-lg">Click to submit</button>
      </form >
    </main >

  );
}

export default RentForm;