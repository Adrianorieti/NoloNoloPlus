import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export default function PersonalPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    let history = useHistory();
    
    useEffect(() =>  {
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
                const parsedDate = JSON.parse(data);
                setName(parsedDate.name);
                setSurname(parsedDate.surname);
                setPhone(parsedDate.phone);
                setEmail(parsedDate.email);
            }).catch(error => {
                console.log(error);
            })
    });

    function leapToUpdate() {
        history.push('/updatepage');
    }

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
                </ul>
            </div>
            <div>
                <button onClick={leapToUpdate}>Cambia le informazioni personali</button>
            </div>
        </div>
    );
}