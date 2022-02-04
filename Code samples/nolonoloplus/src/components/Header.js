import React from 'react';
import NoloNoloLogo from '../images/logo/NoloNoloLogo.png'
import './style/Header.css';

function Header() {
    return (
        <header classname="App-header container-properties center-block mt-0">

                <div className="row d-flex align-items-center">
                    <div className="col-lg-4  ">
                        <span><img className="img-fluid" src={NoloNoloLogo} alt="Prenotazioni NoloNolo" title="Prenotazioni NoloNolo" /></span>
                    </div>

                    <div className="col-lg-4">
                        <span><h4>Welcome to NoloNoloPlus!</h4></span>
                    </div>

                    <div className="col-lg-4">
                        <strong>The easy and safe way to rent a byke for your green travels</strong>
                    </div>

                </div>
            

        </header>


    );
}
export default Header;