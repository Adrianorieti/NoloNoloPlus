import React, { useState } from "react";
import { useHistory } from "react-router";

export default function UserPage() {

    let history = useHistory();
    const [firstName, setfirstName] = useState('');
    const [secondName, setsecondName] = useState('');
    const [phone, setphone] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [repeatPassword, setrepeatPassword] = useState('');
    const [repeatpassError, setrepeatpassError] = useState('');

    window.onload = () => {
        //QUI VORREI ASSEGNARE A TUTTI I FORM L'EVENT LISTENER CON GLI ARGOMENTI PASSATI
        //COME FA https://stackoverflow.com/questions/9643311/pass-a-string-parameter-in-an-onclick-function

        let allForm = document.querySelectorAll("form");
        for (let i = 0; i < allForm.length; i++) {
            allForm[i].addEventListener('submit', submit('pisello'));
        }

    }

    function handleChange(event) {

        switch (event.target.name) {
            case 'firstName':
                setfirstName(event.target.value);
                break;
            case 'secondName':
                setsecondName(event.target.value);
                break;
            case 'phone':
                setphone(event.target.value);
                break;
            case 'email':
                setemail(event.target.value);
                break;
            case 'password':
                setpassword(event.target.value);
                break;
            case 'repeatPassword':
                setrepeatPassword(event.target.value);
                break;
            case 'repeatpassError':
                setrepeatpassError(event.target.value);
        }
    }

    function submit(changedValue) {
        console.log(changedValue);
    }


    return (
        /*
            IN ALTO VORREI FAR VEDERE IN UN MODO PSEUDO CARINO TUTTE LE INFO DELL'UTENTE
            PRENDERE ISPIRAZIONE DA QUALCHE ALTRO SITO CHE LO FA.
            DA FARE CON QUERY AL DB PER PRENDERE I DATI UTENTE.

            DOBBIAMO ANCHE AGGIUNGERE DEI CAMPI ALLE VARIE PERSONE COME: 
            -PREFERENZE DI OGGETTI DA NOLEGGIARE
            -METODO DI PAGAMENTO.

            TUTTO FATTIBILE CON DEI FORM PER OGNI CAMBIAMENTO.
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
            <div className="row gl-mt-3">{/* inizio Nome*/}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change Name</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <form>
                        <div className="form">
                            <label for="name-change-input">New Name</label>
                            <input id="name-change-input" onChange={handleChange} required="required" type="text" name="name"></input>
                        </div>
                        <button type="submit" className="btn btn-warning btn-md gl-button">
                            Update Name
                        </button>
                    </form>
                </div>
            </div>
            <div className="row gl-mt-3">{/* inizio Cognome*/}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change Surname</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <form>
                        <div className="form">
                            <label for="surname-change-input">New Surname</label>
                            <input id="surname-change-input" onChange={handleChange} required="required" type="text" name="surname"></input>
                        </div>
                        <button type="submit" className="btn btn-warning btn-md gl-button">
                            Update Surname
                        </button>
                    </form>
                </div>
            </div>
            <div className="row gl-mt-3">{/* inizio email*/}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change email</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <form>
                        <div className="form">
                            <label for="email-change-input">New email</label>
                            <input id="email-change-input" onChange={handleChange} required="required" type="email" name="email"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="not valid email format"></input>
                        </div>
                        <button type="submit" className="btn btn-warning btn-md gl-button">
                            Update email
                        </button>
                    </form>
                </div>
            </div>
            <div className="row gl-mt-3">{/* inizio password */}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change password</h4>
                    <p>Una volta inserita la vecchia password e successivamente la nuova,
                        si verrà reindirizzati alla pagina di login per loggare con le nuove credenziali.
                    </p>
                </div>
                <div className="col-lg-8">
                    <form>
                        <div className="mb-3">
                            <label for="old-password" className="form-label">Old Password</label>
                            <input onChange={handleChange} id="old-password" type="password" className="form-control" name="password" required="required"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                        </div>
                        <div className="mb-3">
                            <label for="password-change-input" className="form-label">New Password</label>
                            <input onChange={handleChange} id="password-change-input" type="password" className="form-control" name="password" required="required"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                        </div>
                        <div className="mb-3">
                            <label for="repeatPassword" className="form-label">Repeat New Password</label>
                            <input onChange={handleChange} id="repeatPassword" type="password" className="form-control" name="repeatPassword"
                                required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
                            <label for="repeatPassword" style={{ fontSize: 12, color: 'red' }}>{repeatpassError}</label>
                        </div>
                        <button type="submit" className="btn btn-warning btn-md gl-button">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
            <div className="row gl-mt-3">{/* inizio phone */}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change Phone Number</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <form>
                        <div className="form">
                            <label for="phone-change-input">New Phone Number</label>
                            <input id="phone-change-input" onChange={handleChange} required="required" type="tel" pattern="[0-9]{10}" name="phone"></input>
                        </div>
                        <button type="submit" className="btn btn-warning btn-md gl-button">
                            Update Phone Number
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}