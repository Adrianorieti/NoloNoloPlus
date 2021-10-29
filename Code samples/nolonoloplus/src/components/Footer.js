import React from 'react';
import mastercard from '../images/cards/mastercard.png'
import paypal from '../images/cards/paypal.png'
import postepay from '../images/cards/postepay.png'
import satispay from '../images/cards/satispay.png'
import sisalpay from '../images/cards/sisalpay.png'
import visa from '../images/cards/visa.png'
import './Footer.css';

function Footer(props) {
    return (
        <footer className="App-footer container-properties">
            <section className="cards container-fluid">
                <div className="row">
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
            </section>
            <section className="container-fluid info">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h6>{props.companyName}</h6>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, labore. Voluptate consectetur dolorem
                            </p>
                        </div>
                        <div className="col">
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
                        <div className="col">
                            <h6>
                                Contact
                            </h6>
                            <p>{props.locality}</p>
                            <p>{props.mail}</p>
                            <p>{props.number}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="cclicense container-fluid">
                <div className="row d-flex justify-content-center text-center">
                    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img id="commons" className="img-fluid" alt="Licenza Creative Commons" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlnsDct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">&nbsp; Nolo Nolo Plus - </span>&nbsp; <a xmlnsCc="http://creativecommons.org/ns#" href="http://" property="cc:attributionName" rel="cc:attributionURL">Progetto per il Corso di Tecnologie Web Unibo prof. Vitali 2021,</a> &nbsp; è distribuito con Licenza <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale</a>.
                </div>
            </section>
        </footer>
    );
}

export default Footer;