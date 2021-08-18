import React from "react";
import DatePicker from "react-datepicker";
import { useState } from 'react';

import "react-datepicker/dist/react-datepicker.css";

function RentForm()
{

  const [startDate, setStartDate] = useState(new Date());

    return(
//TO-DO RICREARE IL FORM USANDO DATEPICKER PER RENDERLO ACCESSIBILE
        <form className="rentForm"  >
            <h3 id="rentFormdesc">Rent a Bike</h3>
        <div className="mb-3"  role='tab' aria-label="Insert the initial rent date">
        <DatePicker 
      selected={startDate} 
      onChange={date => setStartDate(date)} 
    />
        </div>
        <div className="mb-3">
          <label for="endRent" className="form-label" >Insert the ending rent date in the format month/day/year</label>
          <input type="date" className="form-control" id="endRent" aria-required="true"  aria-autocomplete='none'/>
        </div>
        <div className="mb-3 form-check">
            <label for="products" className="form-label">Choose a product</label>
            <select name="products" className="form-select" aria-label="Default select example, click to choose the product" aria-required="true">
                <option value="mountainBike" selected>Mountain Bike</option>
                <option value="cityBike" >City Bike</option>
                <option value="electricBike" >ELectric Bike</option>
            </select>
          </div>
          {/* IL BOTTONE DOVREBBE POTER RIMANERE COSÌ */}
        <button type="submit" className="btn btn-success" aria-label="Click this button to submit your choices">Start Rent Now</button>
      </form>
    
    );
}

export default RentForm;