import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export default function PersonalPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [activeRes, setActiveRes] = useState('');


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
                setActiveRes(parsedData.activeReservations);
            }).catch(error => {
                console.log(error);
            })
    }, []);

    function deleteAccount() {
        if (activeRes.length != 0) {
            alert('Ci sono delle prenotazioni attive, non è possibile eliminare il proprio account.');
        }
        else {
            //QUI DEVO FARE UNA RICHIESTA PER L'ELIMINAZIONE DELL'ACCOUNT.

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
                <button type="button" onClick={() => { alert('account eliminato'); }}>Clicca per eliminare il proprio account</button>
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