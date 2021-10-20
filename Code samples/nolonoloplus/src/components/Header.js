import React from "react";
import NoloNoloLogo from '../images/NoloNoloLogo.png'
import progettoTecWeb from '../images/progettoTecWeb.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { ProgressPlugin } from "webpack";


function Header() {
    return ( 
        <header className="App-header text-center"> 
            <div className="container-fluid">
                <div class="row">

                    <div className="col-lg-6">
                    <img id="logo" src={NoloNoloLogo} alt="Prenotazioni NoloNolo" title="Prenotazioni NoloNolo"/> 
                    </div>          

                    <div className="col-lg-6">
                    <p> 
                        <a href="https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2020/432290" target="_blank">
                        Corso <img id="sponsor" src={progettoTecWeb} alt="Pogetto Tec Web" title="Progetto Tech Web" />
                        </a>
                    <span>
                        <a href="https://virtuale.unibo.it/pluginfile.php/825017/mod_resource/content/0/25-Progetto2021-2.pdf" target="_blank">
                            <strong> Progetto NoloNolo Plus</strong>
                        </a>
                    </span>
                    
                    </p>
                     
                    </div>
                </div>
            </div>
        </header>
        );
    }
    
    export default Header;