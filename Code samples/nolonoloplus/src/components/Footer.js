import React from 'react';
import mastercard from '../images/cards/mastercard.png'
import paypal from '../images/cards/paypal.png'
import postepay from '../images/cards/postepay.png'
import satispay from '../images/cards/satispay.png'
import sisalpay from '../images/cards/sisalpay.png'
import visa from '../images/cards/visa.png'
import './styles/Footer.css';

function Footer(props) {
    return (
        <footer className="App-footer container-properties">
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, labore. Voluptate consectetur dolorem
                    </p>
                </div>
                <div className="col-md-4">
                    <h6>
                        Products
                    </h6>
                    <p>
                        <a href="#!" className="text-reset">{props.prod1}</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">{props.prod2}</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">{props.prod3}</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">{props.prod4}</a>
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

            <div className="cclicense row d-flex justify-content-center text-center">
                <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                    <img id="commons" className="img-fluid" alt="Licenza Creative Commons" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
                </a>
                <span xmlnsDct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">
                    &nbsp; Nolo Nolo Plus &nbsp;
                </span>
                <a xmlnsCc="http://creativecommons.org/ns#" href="https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2020/432290" property="cc:attributionName" rel="cc:attributionURL">
                    Progetto per il Corso di Tecnologie Web Unibo prof. Vitali 2021,
                </a>
                &nbsp; è distribuito con Licenza
                <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                &nbsp; Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale
                </a>.
            </div>
        </footer>
    );
}

export default Footer;
