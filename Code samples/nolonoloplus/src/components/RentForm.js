import React from "react";
import Datepicker from 'react-ada-keyboard-accessible-datepicker'
//yarn add react-ada-keyboard-accessible-datepicker

function RentForm() {
  return (
    <main>
      <form className="rentForm" >
        <fieldset>
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <Datepicker
              dateFormat={"mm dd, yyyy"}
              minDate={"today"}
              themeColor={"rgb(99, 218, 99)"}
            />
          </section>
          <section className="mb-3">
            <label for="endRent" className="form-label">Ending Rent Date</label>
            <input type="date" className="form-control" id="endRent" required="required" />
          </section>
        </fieldset>
        <fieldset>
          <legend>Bikes types</legend>
          <section className="mb-3 form-check">
            <label for="products" className="form-label">Choose a product</label>
            <select id="products" name="products" className="form-select" aria-label="Default select" required="required">
              <option value="mountainBike" selected>Mountain Bike</option>
              <option value="cityBike" >City Bike</option>
              <option value="electricBike" >ELectric Bike</option>
            </select>
          </section>
        </fieldset>
        <button type="submit" className="btn btn-success">Start Rent Now</button>
      </form>
    </main>

  );
}

export default RentForm;