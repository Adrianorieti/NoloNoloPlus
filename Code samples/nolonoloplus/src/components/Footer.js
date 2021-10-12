import React from 'react';

function Footer(props) {
    return (
        <footer className="text-center text-lg-start bg-custom text-white mt-5" id="footer">
            <section>
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-gem me-3"></i>{props.companyName}
                            </h6>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, labore. Voluptate consectetur dolorem
                            </p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
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
                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contact
                            </h6>
                            <p><i className="fas fa-home me-3"></i> {props.locality}</p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                {props.mail}
                            </p>
                            <p><i className="fas fa-phone me-3"></i> {props.number}</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center p-4">
            <a rel="license"  href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img id="commons" className="img-fluid" alt="Licenza Creative Commons"  src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlnsDct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">Nolo Nolo Plus</span> di<a xmlnsCc="http://creativecommons.org/ns#" href="http://" property="cc:attributionName" rel="cc:attributionURL">Corso Tecnologie Web Unibo prof. Vitali 2021</a> è distribuito con Licenza <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale</a>.
                
            </div>
        </footer>
    );
}

export default Footer;