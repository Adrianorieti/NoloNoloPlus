import React, { useState, useEffect } from "react";
import Card from '../components/ReservationCards';

export default function PastReservations() {
    const [pastRes, setPastRes] = useState('');

    useEffect(() => {
        getInfo();
    }, [])

    function getInfo() {
        const token = JSON.parse(sessionStorage.getItem('token'));
        if (token) {
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
                    setPastRes(parsedData.pastReservations);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    return (
        <main>
            <div>
                {(() => {
                    if (pastRes == null) {
                        return (<div>NON CI SONO PRENOTAZIONI PER IL FUTURO!!</div>)
                    }
                    else if (pastRes.length === 0) {
                        return (<div>NON CI SONO PRENOTAZIONI PER IL FUTURO!!</div>)
                    }
                    else {
                        let cards = [];
                        for (let counter = 0; counter < pastRes.length; counter++) {
                            let reservation = pastRes[counter];
                            cards.push(<Card title={'from ' + reservation.start.slice(0, reservation.start.indexOf('T'))
                                + ' to ' + reservation.end.slice(0, reservation.end.indexOf('T'))}
                                subtitle={reservation.end} //qui secondo me sarebbe carino mettere la categoria, just saying.
                            //oltre a prendere la categoria possiamo prendere la descrizione, da passare alla carta.
                            />)
                        }
                        return (<div>{cards}</div>)
                    }
                })()}
            </div>
        </main>
    );
}