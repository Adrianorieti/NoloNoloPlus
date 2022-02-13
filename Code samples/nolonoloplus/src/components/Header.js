import React from 'react';
import NoloNoloLogo from '../images/logo/NoloNoloLogo.png'
import './style/Header.css';

function Header() {
    return (
        <div className="App-header container-fluid container-properties center-block mt-0">
            <div className="row d-flex align-items-center">
                <div className="col-md-4">
                    <span><img className="img-fluid" src={NoloNoloLogo} alt="Prenotazioni NoloNolo" title="Prenotazioni NoloNolo" /></span>
                </div>

                <div className="col-md-4">
                    <span><h2>Welcome to NoloNoloPlus!</h2></span>
                </div>

                <div className="col-md-4">
                    <strong>The easy and safe way to rent a bike for your green travels</strong>
                </div>
            </div>
        </div>
    );
}
export default Header;