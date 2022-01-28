import React from 'react';
import './style/reservations.css';
function Reservations(props) {

  return (
    <div id="mainReservations">
      <div id="future"><h3>Future</h3>
        {props.user.futureReservations.map((res, index) => {
          return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <button className='btn btn-primary' type='button'>Modify</button>
              <button className='btn btn-danger' type='button'>Remove</button>
            </div>
          </div>)
        })}</div>
      <div id="active"><h3>Active </h3>
        {
          props.user.activeReservations.map((res, index) => {
            console.log("active", res); // qui c'è correttamente
            return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>)
          })
        }
      </div>
      <div id="past">
        <h3>Past</h3>
        {props.user.pastReservations.map((res, index) => {
          console.log("past", res);
          return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <button className='btn btn-primary' type='button'>Fattura</button>
            </div>
          </div>)
        })}
      </div>
    </div>
  )
}


export default Reservations;