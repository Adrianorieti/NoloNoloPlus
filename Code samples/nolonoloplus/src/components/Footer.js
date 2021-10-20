import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer(props) {
    return (
        <footer className="App-footer text-center ">
            <div className="container-fluid">
                <div id="footer-info" className="row">

                    <div className="col-md-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <i className="fas fa-gem me-3"></i>{props.companyName}
                        </h6>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, labore. Voluptate consectetur dolorem
                        </p>
                    </div>

                    <div className="col-md-4">
                        <h6 className="text-uppercase fw-bold mb-4">
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
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contact
                            </h6>
                            <p><i className="fas fa-home me-3"></i> {props.locality}
                            </p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                {props.mail}
                            </p>
                            <p><i className="fas fa-phone me-3"></i> {props.number}
                            </p>
                    </div>

                    <div id="CCLicense">
                        <div  className="text-center p-4">
                            <a rel="license"  href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                                <img id="commons" className="img-fluid" alt="Licenza Creative Commons"  src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
                            </a>  
                            <span xmlnsDct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">
                            &nbsp; Progetto per il &nbsp;
                            </span> 
                            <a xmlnsCc="http://creativecommons.org/ns#" href="http://" property="cc:attributionName" rel="cc:attributionURL">
                                Corso Tecnologie Web Unibo prof. Vitali 2021
                            </a> 
                            &nbsp; NoloNolo Plus è distribuito con Licenza &nbsp;
                            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                                Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale
                            </a>.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;