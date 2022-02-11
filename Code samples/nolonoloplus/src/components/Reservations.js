import React, { useState } from 'react';
import Modify from './Modify';
import { useHistory } from "react-router";
import Invoice from './Invoice';
import './style/reservations.css';
function Reservations(props) {

  const history = useHistory();
  const [modify, setModify] = useState(false);
  const [remove, setRemove] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [resToRemove, setResToRemove] = useState('');
  const [target, setTarget] = useState('');

  function modifyReservation() {
    // quando clicca modify renderizzo un nuovo componente a cui passo tutta la reservation così
    // ho tutti i campi per riempire il form
    // ho bisogno di una get che mi restituisca tutti i prodotti affinchè
    //il dropdown menu sia dinamico
    // poi due campi per la data e due pulsanti per mandare o meno
    console.log("entro qui");
    setModify(true);
  }

  function removeReservation(res) {
    let obj = `{
    "user": "${res.usermail}", 
    "employee": "${res.employee}",
    "start": "${res.start}",
    "end": "${res.end}"
    }`;

    const options = {
      method: 'DELETE',
      headers: new Headers({ 'Content-type': 'application/json' }),
      body: obj
    };
    fetch(`http://localhost:8001/api/rental/${res.product}`, options)
      .then((response) => {
        if (response.status === 200) {
          history.go(0);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div>
      {modify ? <Modify target={target} /> :
        remove ?
          <div>
            <h3>Are you sure?</h3>
            <br />
            <div className="button-wrapper">
              <button className="btn btn-danger" onClick={(() => { removeReservation(resToRemove) })}>Delete</button>
            </div>
          </div> :
          isInvoice ? <Invoice res={invoice} user={props.user} /> :
            (
              <div id="mainReservations">
                <div id="future"><h3>Future</h3>
                  {props.user.futureReservations.map((res, index) => {

                    let start = new Date(res.start)
                    let end = new Date(res.end)

                    return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
                      <div className="card-body">
                        <h5 className="card-title">Product: {res.product}</h5>
                        <p className="card-text"><b>Your rental is going to start on</b>: {start.toDateString()}</p>
                        <p className="card-text"><b>And end on date</b>: {end.toDateString()}</p>
                        <p className="card-text"><b>Total expense</b>: {res.expense}</p>

                        <button className='btn btn-primary' type='button' onClick={(() => { setTarget(res); modifyReservation() })}>Modify</button>
                        <button className='btn btn-danger' type='button' onClick={(() => { setRemove(true); setResToRemove(res); })}>Remove</button>
                      </div>
                    </div>)
                  })}</div>
                <div id="active"><h3>Active </h3>
                  {
                    props.user.activeReservations.map((res, index) => {
                      let start = new Date(res.start)
                      let end = new Date(res.end)
                      return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
                        <div className="card-body">
                          <h5 className="card-title">Product: {res.product}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">Referent: {res.employee}</h6>
                          <p className="card-text"><b>Rent started</b>: {start.toDateString()}</p>
                          <p className="card-text"><b>Will end</b>: {end.toDateString()}</p>
                          <p className="card-text"><b>Total expense</b>: {res.expense}</p>
                        </div>
                      </div>)
                    })
                  }
                </div>
                <div id="past">
                  <h3>Past</h3>
                  {props.user.pastReservations.map((res, index) => {
                    let start = new Date(res.start)
                    let end = new Date(res.end)
                    return (<div className="card" style={{ width: '18rem', margin: '1rem' }}>
                      <div className="card-body">
                        <h5 className="card-title">Product: {res.product}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Referent: {res.employee}</h6>
                        <p className="card-text"><b>Rent started</b>: {start.toDateString()}</p>
                        <p className="card-text"><b>Ended</b>: {end.toDateString()}</p>
                        <p className="card-text"><b>Total expense</b>: {res.expense}</p>
                        <button className='btn btn-primary' type='button' onClick={(() => { setInvoice(res); setIsInvoice(true); })}>Fattura</button>
                      </div>
                    </div>)
                  })}
                </div>
              </div>
            )}</div>)
}


export default Reservations;