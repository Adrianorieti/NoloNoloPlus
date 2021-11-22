import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export default function PersonalPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [activeRes, setActiveRes] = useState('');
    const [futureRes, setFutureRes] = useState('');
    const [result, setResult] = useState('');


    let history = useHistory();

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` })
        };
        const url = 'http://localhost:8001/api/customer/getInfo';
        fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                const parsedData = JSON.parse(data);
                setName(parsedData.name);
                setSurname(parsedData.surname);
                setPhone(parsedData.phone);
                setEmail(parsedData.email);
                setPaymentMethod(parsedData.paymentMethod);
                setFutureRes(parsedData.futureReservations);
                setActiveRes(parsedData.activeReservations);
            }).catch(error => {
                console.log(error);
            })
    }, []);

    function remove(reservation) {
        const token = JSON.parse(sessionStorage.getItem('token'));
        let obj = `{
            "startingDate": "${reservation.start}",
            "endingDate": "${reservation.end}",
            "prodName": "${reservation.name}"
        }`;
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
            body: obj
        };
        const url = 'http://localhost:8001/api/customer/removeReservation';
        fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    console.log("eliminazione avvenuta con successo");
                    setResult(1);
                }
            })
            .catch(error => {
                console.log(error);
                setResult(-1);
            });
    }

    function deleteAccount() {
        if (activeRes) {
            if (activeRes.length != 0) {
                alert('Ci sono delle prenotazioni attive, non è possibile eliminare il proprio account.');
            }
            else {
                //QUI DEVO FARE UNA RICHIESTA PER L'ELIMINAZIONE DELL'ACCOUNT.
                if (futureRes) {
                    if (futureRes.length != 0) {
                        //qui devo cancellare tutte le prenotazioni future, anche dai prodotti
                        for (let i in futureRes) {
                            remove(futureRes[i]);
                            if (result === -1) {
                                alert("cancellazione account non è andata a buon fine, riprovare");
                                history.push('/personalpage');
                            }
                        }
                    }
                    //qui la length è zero e posso eliminare l'account con richiesta a server.

                    const token = JSON.parse(sessionStorage.getItem('token'));
                    const options = {
                        method: 'POST',
                        headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` })
                    };
                    const url = 'http://localhost:8001/api/customer/deleteaccount';
                    //cancello account dal database
                    fetch(url, options)
                        .then(response => {
                            if (response.status === 200) {
                                //se tutto va bene faccio il logout (tolgo token) e reindirizzo alla pagine principale.
                                console.log("eliminazione avvenuta con successo");
                                sessionStorage.clear();
                                history.push('/');
                            }
                            else if (response.status === 500) {
                                console.log("errore del server, riprovare.");
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                else {
                    console.log("future res è null");
                }
            }
        }
        else {
            console.log("active res è null");
        }
    }

    return (
        <div>
            <div>
                Ciao come stai?
                Queste sono le tue informazioni:
                <ul>
                    <li>Name: {name}</li>
                    <li>Surname: {surname}</li>
                    <li>Phone: {phone}</li>
                    <li>Email: {email}</li>
                    <li>Payment Method: {paymentMethod}</li>
                </ul>
            </div>
            <div>
                <button type="button" onClick={() => { history.push('/updatepage'); }}>Clicca per cambiare le informazioni personali</button>
            </div>
            <div>
                <button type="button" onClick={deleteAccount}>Clicca per eliminare il proprio account</button>
            </div>
            <h2>PRENOTAZIONI FUTURE</h2>
            <div>
                <button type="button" onClick={() => { history.push('/futurereservations'); }}>Clicca per visualizzare le prenotazioni future</button>
            </div>
            <h2>PRENOTAZIONI ATTIVE</h2>
            <div>
                <button type="button" onClick={() => { history.push('/activereservations'); }}>Clicca per visualizzare le prenotazioni passate</button>
            </div>
            <h2>PRENOTAZIONI CONCLUSE</h2>
            <div>
                <button type="button" onClick={() => { history.push('/pastreservations'); }}>Clicca per visualizzare le prenotazioni passate</button>
            </div>
        </div>
    );
}