import React from "react";

function RentForm() {
  return (
    <main>
      <form className="rentForm">
        <fieldset>
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <label for="startRent" className="form-label">Initial Rent Date</label>
            <input type="date" className="form-control" id="startRent" required="required" />
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