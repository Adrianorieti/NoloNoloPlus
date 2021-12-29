import React from 'react';
import './style/Howitworks.css';


function Howitworks() {
    return (

        <div class="container-fluid">
            <div class="row App-how">
                <div className="howitworks col-lg-12">
                    <div className="container">
                        <div className="text-center">
                            <h2>How does it work?</h2>
                            <span className="subtitle">This is the bike rental platform perfect for you!</span>
                        </div>

                        <div className="row">
                            <div className="col-sm-4 text-center howitworks-block">
                                <div className="inner">
                                    <div className="how-it-works-icon">
                                        <span className="stepnumber">1</span>
                                        <img src="https://cdn.bimbimbikes.com/images/icons/how-it-works-1.svg?v1.1.28" />
                                    </div>
                                    <span className="steptitle">Find the bike</span>
                                    <span className="stepdesc">Compare price and types of bikes, all in a few clicks with NoloNolo!</span>
                                </div>
                            </div>
                            <div className="col-sm-4 text-center howitworks-block">
                                <div className="inner">
                                    <div className="how-it-works-icon">
                                        <span className="stepnumber">2</span>
                                        <img src="https://cdn.bimbimbikes.com/images/icons/how-it-works-2.svg?v1.1.28" />
                                    </div>
                                    <span className="steptitle">Book your bike directly online</span>
                                    <span className="stepdesc">No wasting time finding a rental on site..</span>
                                </div>
                            </div>
                            <div className="col-sm-4 text-center howitworks-block last">
                                <div className="inner">
                                    <div className="how-it-works-icon">
                                        <span className="stepnumber">3</span>
                                        <img src="https://cdn.bimbimbikes.com/images/icons/how-it-works-3.svg?v1.1.28" />
                                    </div>
                                    <span className="steptitle">You have your bike!</span>
                                    <span className="stepdesc">Enjoy the holiday. Any problems? Our team is ready to help you! </span>
                                </div>
                            </div>
                            <div class="col-lg-12 text-center">
                                <span className="subtitle">Rent your bike now?  </span>
                                <span className="above">
                                    Give us just some information in order to find the best for you.
                                </span>
                                <p>Follow the form above...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default Howitworks;