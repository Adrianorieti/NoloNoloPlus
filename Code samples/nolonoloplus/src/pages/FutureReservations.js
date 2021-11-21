import React, { useState, useEffect } from "react";
import Card from '../components/ReservationCards';
import { useHistory } from "react-router";

export default function FutureReservations({ resToParent }) {
    const [futureReservations, setFutureReservations] = useState(null);
    let history = useHistory();

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
                    setFutureReservations(parsedData.futureReservations);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    //TESTATA E FUNZIONA
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
                    history.push('/personalpage');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    function modify(reservation) {
        resToParent(reservation);
        history.push('/modifyreservation');
    }

    return (
        <main>
            <div>
                {(() => {
                    if (futureReservations == null) {
                        return (<div>NON CI SONO PRENOTAZIONI PER IL FUTURO!!</div>)
                    }
                    else if (futureReservations.length === 0) {
                        return (<div>NON CI SONO PRENOTAZIONI PER IL FUTURO!!</div>)
                    }
                    else {
                        let cards = [];
                        for (let counter = 0; counter < futureReservations.length; counter++) {
                            let reservation = futureReservations[counter];
                            cards.push(<Card title={'from ' + reservation.start.slice(0, reservation.start.indexOf('T'))
                                + ' to ' + reservation.end.slice(0, reservation.end.indexOf('T'))}
                                subtitle={reservation.end} //qui secondo me sarebbe carino mettere la categoria, just saying.
                                //oltre a prendere la categoria possiamo prendere la descrizione, da passare alla carta.
                                remove={() => { remove(reservation); }}
                                modify={() => { modify(reservation); }} />)
                        }
                        return (<div>{cards}</div>)
                    }
                })()}
            </div>
        </main>
    );
}