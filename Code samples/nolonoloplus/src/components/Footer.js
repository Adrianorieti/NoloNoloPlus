import React from 'react';
import mastercard from '../images/cards/mastercard.png'
import paypal from '../images/cards/paypal.png'
import postepay from '../images/cards/postepay.png'
import satispay from '../images/cards/satispay.png'
import sisalpay from '../images/cards/sisalpay.png'
import visa from '../images/cards/visa.png'
import './style/Footer.css';

function Footer(props) {
    return (
        <div className="App-footer container-fluid">
            <div className="row cards">
                <div className="col-md-2">
                    <img id="card" src={mastercard} alt="You can pay with Mastercard" />
                </div>
                <div className="col-md-2">
                    <img src={paypal} alt="You can pay with Paypal" />
                </div>
                <div className="col-md-2">
                    <img src={postepay} alt="You can pay with Postepay" />
                </div>
                <div className="col-md-2">
                    <img src={satispay} alt="You can pay with Satispay" />
                </div>
                <div className="col-md-2">
                    <img src={sisalpay} alt="You can pay with Sisalplay" />
                </div>
                <div className="col-md-2">
                    <img src={visa} alt="You can pay with Visa credit card" />
                </div>
            </div>

            <div className="row info">
                <div className="col-md-4">
                    <h6>{props.companyName}</h6>
                    <p>
                    We are a rental agency specialized in green movement. 
                    Our history begin in the far 1990 in this amazing territory.
                    </p>
                </div>
                <div className="col-md-4">
                    <h6>
                        Products
                    </h6>
                    <p>
                        <a href="#!" className="text-reset">City bikes</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Electric Scooter</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Special Bikes</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Mountain bikes</a>
                    </p>
                </div>
                <div className="col-md-4">
                    <h6>
                        Contact
                    </h6>
                    <p>{props.locality}</p>
                    <p>{props.mail}</p>
                    <p>{props.number}</p>
                </div>
            </div>

            <div className="row cclicense d-flex justify-content-center text-center">
                <div className="col-md-12 ccimage">
                    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                        <img id="commons" className="img-fluid" alt="Licenza Creative Commons" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
                    </a>
                    <span xmlnsDct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">
                        &nbsp; Nolo Nolo Plus &nbsp;
                    </span>
                    <a xmlnsCc="http://creativecommons.org/ns#" href="https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2020/432290" property="cc:attributionName" rel="cc:attributionURL" target="_blank">
                        Progetto per il Corso di Tecnologie Web Unibo prof. Vitali 2021,
                    </a>
                    &nbsp; è distribuito con Licenza
                    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
                        &nbsp; Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale
                    </a>.
                </div>
            </div>
        </div>
    );
}

export default Footer;