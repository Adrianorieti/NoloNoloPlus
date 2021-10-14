import React, { useState } from "react";
import { useHistory } from "react-router";

export default function UserPage() {

    return (
        /*
            IN ALTO VORREI FAR VEDERE IN UN MODO PSEUDO CARINO TUTTE LE INFO DELL'UTENTE
            PRENDERE ISPIRAZIONE DA QUALCHE ALTRO SITO CHE LO FA.
            DA FARE CON QUERY AL DB PER PRENDERE I DATI UTENTE.

            DOBBIAMO ANCHE AGGIUNGERE DEI CAMPI ALLE VARIE PERSONE COME: 
            -PREFERENZE DI OGGETTI DA NOLEGGIARE.
            -METODO DI PAGAMENTO.

            INFORMAZIONI DA FAR CAMBIARE:
            -PASSWORD
            -EMAIL
            -NOME E COGNOME
            -NUMERO DI TELEFONO

            TUTTE LE VOLTE CHE CAMBIAMO UN DATO, FACCIAMO IL REFRESH DELLA PAGINA, IN QUESTO MODO AGGIORNIAMO I DATI A SCHERMO.
            FORSE PIÙ CHE AGGIORNARE POSSO CAMBIARE A MANO IL DATO, COSÌ NON VADO A FARE UNA RICHIESTA AL DB.
            UNA VOLTA CAMBIATA LA PASSWORD, BISOGNEREBBE FARLO LOGGARE NUOVAMENTE.
            CAPIRE SE QUANDO SI CAMBIA EMAIL, BISOGNA EVENTUALMENTE DARE UN NUOVO TOKEN AL NOSTRO UTENTE.

            NON SI PUÒ MAI ACCEDERE/VEDERE LA PAGINE UTENTE ASSOCIATA AD UN ALTRO UTENTE!

            LA PAGINE PER OGNI UTENTE PUÒ ESSERE ASSOCIATA:
            -AD UNO USERNAME( QUESTO COMPORTA UNA VERIFICA IN FASE DI REGISTRAZIONE DI UNICITÀ.)
            -AD UNA STRINGA UNIVOCA PER OGNI UTENTE
            -AL TOKEN CHE OGNI UTENTE HA UNA VOLTA FATTO IL LOGIN.
            OGNUNO DI QUESTI METODI PERÒ COMPORTA UN CONTROLLO SERVER SIDE CON IL TOKEN PER VERIFICARE CHE NON STIA ACCEDENDO ALLA PAGINA DI UN ALTRO.
            
            PROBABILMENTE IL METODO MIGLIORE È QUELLO CHE COMPORTA IL CONTROLLO DEL TOKEN PER VISUALIZZARE LE INFORMAZIONI.

            LATO SERVER SIDE, SE FACCIO UNA GET A QUESTA PAGINE SENZA IL TOKEN DI SESSIONE, O CON TOKEN NON VALIDO, FA REINDIRIZZARE AL LOGIN.
            IN PRIMA BATTUTA IMPLEMENTABILE SENZA POI ESSERE INDIRIZZATO ALLA PAGINE UTENTE SUBITO DOPO, MA SAREBBE CARINO RIUSCIRLO A FARE.
            MOLTO CARINO COME URI /-/PERSONALPAGE
            
        */
        <div>
            <div className="row gl-mt-3">
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change email</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <div>
                        <div className="form">
                            <label for="email-change-input">New email</label>
                            <input id="email-change-input" required="required" type="text"></input>
                        </div>
                        <button type="button" className="btn btn-warning btn-md gl-button" disabled="disabled">
                            Update email
                        </button>
                    </div>
                </div>
            </div>
            <div className="row gl-mt-3">
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change email</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <div>
                        <div className="form">
                            <label for="email-change-input">New email</label>
                            <input id="email-change-input" required="required" type="text"></input>
                        </div>
                        <button type="button" className="btn btn-warning btn-md gl-button" disabled="disabled">
                            Update email
                        </button>
                    </div>
                </div>
            </div>
            <div className="row gl-mt-3">
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change email</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <div>
                        <div className="form">
                            <label for="email-change-input">New email</label>
                            <input id="email-change-input" required="required" type="text"></input>
                        </div>
                        <button type="button" className="btn btn-warning btn-md gl-button" disabled="disabled">
                            Update email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}