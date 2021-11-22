import React, { useState } from "react";
import { useHistory } from "react-router";

export default function UpdatePage({ nameToParent }) {

    let history = useHistory();
    const [repeatpassError, setrepeatpassError] = useState('');

    /* Confronta la password immessa e quella ripetuta.
   Ritorna false se sono diferse, true se uguali. */
    function passValidate(newPassword) {
        const repeatNewPassword = document.querySelector("#repeatPassword-change-input").value;
        if (repeatNewPassword !== newPassword) {
            setrepeatpassError(" Passwords don't matches");
            return false;
        }
        return true;
    };


    function createJSON_andTest(formId) {
        //in questa funzione devo creare il json da mandare al server
        let obj;
        switch (formId) {
            case 'name':
                //devo in un qualche modo cambiare il session storage.
                //prendo nome ad input e mi creo il json da mandare
                let name = document.querySelector("#name-change-input");
                obj = `{
                    "type" : "name",
                    "name" : "${name.value}"
                }`;
                submit(obj);
                name.value = '';
                break;
            case 'surname':
                //prendo cognome ad input e mi creo il json da mandare
                let surname = document.querySelector("#surname-change-input");
                obj = `{
                    "type" : "surname",
                    "surname" : "${surname.value}"
                }`;
                surname.value = '';
                submit(obj);
                break;
            case 'phone':
                //prendo numero ad input e mi creo il json da mandare
                let phone = document.querySelector("#phone-change-input");
                obj = `{
                    "type" : "phone",
                    "phone" : "${phone.value}"
                }`;
                phone.value = '';
                submit(obj);
                break;
            case 'password':
                //prendo password ad input e mi creo il json da mandare
                let oldPassword = document.querySelector("#oldPassword-change-input");
                let newPassword = document.querySelector("#password-change-input").value;
                if (passValidate(newPassword)) {
                    //a questo punto so che ha inserito correttamente le due password ripetute.
                    //// Password encoding to ensure escapes characters to be send without problems
                    let buff = Buffer.from(oldPassword.value, 'utf-8');
                    const encoded_oldPass = buff.toString('base64');

                    let buff2 = Buffer.from(newPassword, 'utf-8');
                    const encoded_newPass = buff2.toString('base64');
                    obj = `{
                        "type" : "password",
                        "oldPassword" : "${encoded_oldPass}",
                        "newPassword" : "${encoded_newPass}"
                    }`;
                    const token = JSON.parse(sessionStorage.getItem('token'));
                    const options = {
                        method: 'POST',
                        headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
                        body: obj
                    };
                    const url = 'http://localhost:8001/api/customer/passw-validation';
                    fetch(url, options)
                        .then(response => {
                            if (response.status === 401) {
                                //LA PASSWORD NON COINCIDE!
                                alert("la password inserita è sbagliata");
                                oldPassword.value = '';
                            }
                            else {
                                //È ANDATO TUTTO BENE, POSSIAMO CHIAMARE SUBMIT.
                                submit(obj);
                            }
                        }).catch(error => {
                            console.log(error);
                        })
                }
                else {
                    //SETTA UNO STATO DI ERRORE!
                }
                break;
            default:
                //prendo mail da input apposta e poi me creo json da mandare.
                let email = document.querySelector("#email-change-input");
                obj = `{
                    "type" : "email",
                    "email" : "${email.value}"
                }`;
                //può darsi che la mail l'abbia già nel database, quindi devo fare quel check.
                const options = {
                    method: 'POST',
                    headers: new Headers({ 'Content-type': 'application/json' }),
                    body: obj
                };
                const url = 'http://localhost:8001/api/customer/email-validation';
                fetch(url, options)
                    .then(response => {
                        if (response.status === 400) {
                            //LA MAIL È GIÀ UTILIZZATA DA QUALCUNO SETTIAMO LO STATO DI ERRORE!
                            alert("questa mail è già stata utilizzata!");
                        }
                        else {
                            //È ANDATO TUTTO BENE, POSSIAMO CHIAMARE SUBMIT.
                            submit(obj);
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                break;
        }
    }

    function submit(obj) {
        //in questa funzione devo creare il json da mandare al server, e poi mandarlo al server.
        //in case di password, devo fare prima un controllino veloce che le due password siano uguali.
        alert(obj);
        const parsedObj = JSON.parse(obj);
        //prendiamo token dal session storage
        const token = JSON.parse(sessionStorage.getItem('token'));
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
            body: obj
        };
        const url = 'http://localhost:8001/api/customer/update';
        fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    alert("è andato tutto bene");
                    if (parsedObj.type === 'name') {
                        sessionStorage.setItem('username', JSON.stringify(parsedObj.name));
                        nameToParent(parsedObj.name);
                        history.push('/personalpage');
                    }
                    else if (parsedObj.type === 'email' || parsedObj.type === 'password') {
                        sessionStorage.clear();
                        history.push('/login');
                    }
                    else {
                        history.push('/personalpage');
                    }
                }
                else {
                    alert("C'È STATO UN ERRORE");
                }
            }).catch(error => {
                console.log(error);
            })
    }


    return (
        /*
            L'IDEA È QUELLA DI AVERE LA PAGINA PERSONALE IN CUI SI VISUALIZZANO I DATI DELL'UTENTE TRANNE LA PASSWORD,
            POI DALLA PAGINA PERSONALE, SERVE UN LINK A QUESTA PAGINA DI UPDATE INFORMAZIONI.
            LA PAGINA UTENTE FARÀ IN MODO DI VEDERE LE INFO, E SI FA SEMPRE UNA QUERY AL DB.

            DOBBIAMO ANCHE AGGIUNGERE DEI CAMPI ALLE VARIE PERSONE COME: 
            -PREFERENZE DI OGGETTI DA NOLEGGIARE
            -METODO DI PAGAMENTO.

            TUTTE LE VOLTE CHE CAMBIAMO UN DATO, REINDIRIZZIAMO ALLA PAGINA PERSONALE,
            CHE VISTO CHE FA SEMPRE DELLE RICHIESTE AL DB AVRÀ TUTTI I DATI UP TO DATE.
            UNA VOLTA CAMBIATA LA PASSWORD, BISOGNEREBBE FARLO LOGGARE NUOVAMENTE. FORSE ANCHE POST CAMBIO EMAIL.
            PER ORA IL TOKEN È BASATO SU NAME E BASTA, MA VA PROBABILMENTE CAMBIATO.

            LATO SERVER SIDE, SE FACCIO UNA GET A QUESTA PAGINE SENZA IL TOKEN DI SESSIONE, O CON TOKEN NON VALIDO, FA REINDIRIZZARE AL LOGIN.
            IN PRIMA BATTUTA IMPLEMENTABILE SENZA POI ESSERE INDIRIZZATO ALLA PAGINE UTENTE SUBITO DOPO, MA SAREBBE CARINO RIUSCIRLO A FARE.
            MOLTO CARINO COME URI /-/PERSONALPAGE

            DEVO RICORDARMI ANCHE DI SETTARE PER BENE GLI ERRORI.
        */

        <div>
            <div className="row gl-mt-3">{/* inizio Nome*/}
                <div className="col-lg-4 profile-settings-sidebar">
                    <h4 className="gl-mt-0 warning-title">Change Name</h4>
                    <p>qui potrei scrivere qualcosa di carino</p>
                </div>
                <div className="col-lg-8">
                    <form onSubmit={(event) => { event.preventDefault(); createJSON_andTest('name'); }}>
                        <div className="form" >
                            <label htmlFor="name-change-input">New Name</label>
                            <input id="name-change-input" required="required" type="text" name="name"></input>
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
                    <form onSubmit={(event) => { event.preventDefault(); createJSON_andTest('surname'); }}>
                        <div className="form">
                            <label htmlFor="surname-change-input">New Surname</label>
                            <input id="surname-change-input" required="required" type="text" name="surname"></input>
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
                    <form onSubmit={(event) => { event.preventDefault(); createJSON_andTest('email'); }}>
                        <div className="form">
                            <label htmlFor="email-change-input">New email</label>
                            <input id="email-change-input" required="required" type="email" name="email"
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
                    <form onSubmit={(event) => { event.preventDefault(); createJSON_andTest('password'); }}>
                        <div className="mb-3">
                            <label htmlFor="oldPassword-change-input" className="form-label">Old Password</label>
                            <input id="oldPassword-change-input" type="password" className="form-control" name="password" required="required"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password-change-input" className="form-label">New Password</label>
                            <input id="password-change-input" type="password" className="form-control" name="password" required="required"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="repeatPassword-change-input" className="form-label">Repeat New Password</label>
                            <input id="repeatPassword-change-input" type="password" className="form-control" name="repeatPassword"
                                required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
                            <label htmlFor="repeatPassword-change-input" style={{ fontSize: 12, color: 'red' }}>{repeatpassError}</label>
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
                    <form onSubmit={(event) => { event.preventDefault(); createJSON_andTest('phone'); }}>
                        <div className="form">
                            <label htmlFor="phone-change-input">New Phone Number</label>
                            <input id="phone-change-input" required="required" type="tel" pattern="[0-9]{10}" name="phone"></input>
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