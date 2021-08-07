import React from "react";

function RentForm()
{
    return(

        <form className="rentForm">
            <span><h3>Rent a Bike</h3></span>
        <div className="mb-3">
          <label for="startRent" className="form-label">Initial Rent Date</label>
          <input type="date" className="form-control" id="startRent" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
          <label for="endRent" className="form-label">Ending Rent Date</label>
          <input type="date" className="form-control" id="endRent"/>
        </div>
        <div className="mb-3 form-check">
            <label for="products" className="form-label">Choose a product</label>
            <select name="products" className="form-select" aria-label="Default select example">
                <option value="mountainBike" selected>Mountain Bike</option>
                <option value="cityBike" >City Bike</option>
                <option value="electricBike" >ELectric Bike</option>
            </select>
          </div>
        <button type="submit" className="btn btn-success">Start Rent Now</button>
      </form>
    
    );
}

export default RentForm;