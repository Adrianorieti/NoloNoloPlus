import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export default function PersonalPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [futureReservations, setFutureReservations] = useState('');
    const [pastReservations, setPastReservations] = useState('');


    let history = useHistory();

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` })
        };
        const url = 'http://localhost:8001/api/getInfo';
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
                setFutureReservations(parsedData.futureReservations);
                setPastReservations(parsedData.pastReservations);
            }).catch(error => {
                console.log(error);
            })
    });

    return (
        <div>
            <div>
                ciao come stai?
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
                <button onClick={() => { history.push('/updatepage'); }}>Cambia le informazioni personali</button>
            </div>
        </div>
    );
}