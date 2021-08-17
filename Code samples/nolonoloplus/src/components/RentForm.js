import React from "react";

function RentForm()
{
    return(

        <form className="rentForm"  >
            <h3>Rent a Bike</h3>
        <div className="mb-3"  >
          <label for="startRent" className="form-label">Insert the initial rent date in the format month/day/year</label>
          <input type="date" className="form-control" id="startRent" aria-describedby="initialRentData" aria-required="true"/>
        </div>
        <div className="mb-3">
          <label for="endRent" className="form-label" >Insert the ending rent date in the format month/day/year</label>
          <input type="date" className="form-control" id="endRent" aria-required="true"  />
        </div>
        <div className="mb-3 form-check">
            <label for="products" className="form-label">Choose a product</label>
            <select name="products" className="form-select" aria-label="Default select example, click to choose the product" aria-required="true">
                <option value="mountainBike" selected>Mountain Bike</option>
                <option value="cityBike" >City Bike</option>
                <option value="electricBike" >ELectric Bike</option>
            </select>
          </div>
        <button type="submit" className="btn btn-success" aria-label="Click this button to submit your choices">Start Rent Now</button>
      </form>
    
    );
}

export default RentForm;