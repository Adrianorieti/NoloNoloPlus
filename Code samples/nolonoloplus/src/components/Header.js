import React from 'react';
import NoloNoloLogo from '../images/logo/NoloNoloLogo.png'
import './style/Header.css';

function Header() {
    return (
        <header classname="App-header container-properties center-block">

            <div class="row">
                <div className="col-lg-6">
                    <img className="logo img-fluid" src={NoloNoloLogo} alt="Prenotazioni NoloNolo" title="Prenotazioni NoloNolo" />
                </div>
                <div className="col-lg-6">

                    <span><h3>Welcome to NoloNoloPlus!</h3></span>

                    <p>
                        <span>
                            <strong>
                                The easy and safe way to rent a byke for your green travels.
                            </strong>
                        </span>
                    </p>
                </div>
            </div>

        </header>


    );
}
export default Header;