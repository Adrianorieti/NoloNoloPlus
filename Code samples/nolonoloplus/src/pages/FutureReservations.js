import React, { useState, useEffect } from "react";
import Card from '../components/ReservationCards';
import { useHistory } from "react-router";

export default function FutureReservations({ resToParent }) {
    const [futureReservations, setFutureReservations] = useState('');

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
                //setFutureReservations(parsedData.futureResevations);
                setFutureReservations(parsedData.name);
            }).catch(error => {
                console.log(error);
            })
    });

    function remove(reservation) {
        // const token = JSON.parse(sessionStorage.getItem('token'));
        // let obj = `{
        //     startingDate: reservation.start,
        //     endingDate: reservation.end,
        //     prodName: reservation.name
        // }`;
        // const options = {
        //     method: 'POST',
        //     headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
        //     body: obj
        // };
        // const url = 'http://localhost:8001/api/removeReservation';
        // fetch(url, options)
        //     .then(response => {
        //         if (response.status === 200) {
        //             console.log("eliminazione avvenuta con successo");
        //             history.push('/personalpage');
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //     });
        alert('ciao');
    }

    function modify(reservation) {
        resToParent(reservation);
        history.push('/modifyreservation');
    }

    return (
        <main>
            <div>
                {(() => {
                    if (!futureReservations) {
                        return (<div>NON CI SONO PRENOTAZIONI PER IL FUTURO!!</div>)
                    }
                    else {
                        let cards = [];
                        for (let counter = 0; counter < futureReservations.length; counter++) {
                            cards.push(<Card title={'prova' + ' ' + counter} subtitle={'prova' + ' ' + counter} remove={() => { remove(futureReservations[counter]); }}
                                modify={() => { modify(futureReservations[counter]); }} />)
                        }
                        return (<div>{cards}</div>)
                    }
                })()}
            </div>
        </main>
    );
}