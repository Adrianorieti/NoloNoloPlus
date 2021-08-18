import React from "react";
import DatePicker from "react-datepicker";
import { useState } from 'react';

import "react-datepicker/dist/react-datepicker.css";

function RentForm() {

  const [startDate, setStartDate] = useState(new Date());

  return (
    <main>
      <form className="rentForm">
        <fieldset>
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
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