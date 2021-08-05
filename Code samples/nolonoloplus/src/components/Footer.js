import React from 'react';

function Footer(props) {
    return (
        <footer className="text-center text-lg-start bg-custom text-white">
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
                © 2021 Copyright: {props.copyright}
            </div>
        </footer>
    );
}

export default Footer;