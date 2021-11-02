import React from 'react';

export default function Cards(props) {

    //DOBBIAMO FARE IN MODO DI AVERE LE FATTURE FATTE PER BENE.
    return (
        // <div className="card" style="width: 18rem;">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{props.subtitle}</h6>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <button type="button" onClick={props.modify} className="btn btn-success">Modifica</button>
                <button type="button" onClick={props.remove} className="btn btn-danger">Elimina</button>
                <button type="button" className="btn btn-secondary">Fattura</button>
            </div>
        </div>
    )
}