import React from 'react';
import NoloNoloLogo from '../images/logo/NoloNoloLogo.png'
import progettoTecWeb from '../images/logo/progettoTecWeb.png'
import './Header.css';

function Header() {
    return (
        <header classname="App-header container-properties">

                <div class="row">
                    <div className="col-lg-6">
                        <img className="logo img-fluid" src={NoloNoloLogo} alt="Prenotazioni NoloNolo" title="Prenotazioni NoloNolo" />
                    </div>
                    <div className="sponsor col-lg-6">
                        <p> <a href="https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2020/432290" target="_blank">
                            <span><strong>Corso</strong></span>
                            <img className="img-fluid" src={progettoTecWeb} alt="Pogetto Tec Web" title="Progetto Tech Web" /></a>
                        </p>
                    </div>
                </div>
            
        </header >
    );
}
export default Header;