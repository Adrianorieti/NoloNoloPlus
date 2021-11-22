import React, { useState } from "react";
import RangeDaysPicker from "../components/RangeDaysPicker";
import Rental from '../components/Rental';
import { useHistory } from "react-router";

export default function ModifyReservation(props) {
    const [formObj, setFormObj] = useState('');
    const [formDataProduct, setformDataProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [prodName, setProdName] = useState('');
    let history = useHistory();

    //TESTATA E FUNZIONANTE
    function recreateRes() {
        let obj = {
            operation: 'create',
            start: props.res.start,
            end: props.res.end,
            prodName: props.res.name
        };
        const token = JSON.parse(sessionStorage.getItem('token'));
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
            body: JSON.stringify(obj)
        };
        const url = 'http://localhost:8001/api/customer/modifypreparation';
        fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    console.log('creazione avvenuta con successo');
                }
            })
            .catch(error => {
                console.log("siamo qua");
                console.log(error);
            })
    }

    function lookAtReservations(startingDate, endingDate, category) {
        //in realtà lui non vuole il nome ma la collection a cui appartiene.
        let obj = {
            startingDate: startingDate,
            endingDate: endingDate,
            name: category
        };
        setFormObj(obj);
        const token = JSON.parse(sessionStorage.getItem('token'));
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
            body: JSON.stringify(obj)
        };
        const url = 'http://localhost:8001/api/services/formProducts';
        fetch(url, options)
            .then(response => {
                //qui devo analizzare per bene quello che mi ritorna fratello.
                return response.json();
            }).then(data => {
                recreateRes();
                setAvailable(data.availability);
                console.log(data.availability);
                setformDataProduct(data.prod);
                setPrice(data.finalPrice);
                //nome del PRODOTTO singolo in questione e NON LA CATEGORIA
                setProdName(data.currProdName);
                ///adesso in ordine elimino la vecchia reservation e poi creo quella nuova. //per crearla basta usare addRent
            })
            .catch(error => {
                console.log(error);
            })
    }

    //TESTATA E FUNZIONANTE
    function getCategory(newStartingDate, newEndingDate, prodName) {
        let obj = {
            prodName: prodName
        }
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json' }),
            body: JSON.stringify(obj)
        };
        const url = 'http://localhost:8001/api/services/getCategory';
        fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(data => {
                const parsedData = JSON.parse(data);
                lookAtReservations(newStartingDate, newEndingDate, parsedData.category);
            })
            .catch(error => {
                console.log(error);
            })
    }

    //TESTATA E FUNZIONANTE
    function submit() {
        let newStartingDate = document.querySelector("#fromDate").innerHTML;
        let newEndingDate = document.querySelector("#toDate").innerHTML;
        if ((!newStartingDate && !newEndingDate)) {
            //una delle due è nulla
            //bisognerebbe controllare anche se il tipo mette una data inferiore a oggi.
            alert("devi inserire le nuove date in modo valido idiota.");
        }
        else {
            //in questo caso start ed end sono delle date vere e proprie.
            let prepModObj = {
                operation: 'remove',
                start: props.res.start,
                end: props.res.end,
                prodName: props.res.name
            };
            const token = JSON.parse(sessionStorage.getItem('token'));
            const prepModOptions = {
                method: 'POST',
                headers: new Headers({ 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
                body: JSON.stringify(prepModObj)
            };
            const prepModUrl = 'http://localhost:8001/api/customer/modifypreparation';
            fetch(prepModUrl, prepModOptions)
                .then(response => {
                    if (response.status === 200) {
                        console.log('eliminazione avvenuta con successo');
                        //qui chiamiamo funzione che serve a chiamare la api di adriano.
                        getCategory(newStartingDate, newEndingDate, props.res.name);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    return (
        <main>
            {(() => {
                if (formDataProduct) {
                    if (!available) {
                        alert('non ci sono cose available in questo periodo')
                        history.push('/futurereservations');
                    }
                    else {
                        //abbiamo qualcosa di disponibile.
                        return (<Rental categoryName={formDataProduct.name} productName={prodName} startDate={formObj.startingDate} endDate={formObj.endingDate}
                            price={price} description={formDataProduct.description} oldStartDate={props.res.start} oldEndDate={props.res.end} oldProdName={props.res.name} />)
                    }
                }
                else {
                    return (<form >
                        <h2>Old Dates: {props.res.start && props.res.start.slice(0, props.res.start.indexOf('T'))}
                            {props.res.start && ' to '} {props.res.end && props.res.end.slice(0, props.res.end.indexOf('T'))}</h2>
                        <fieldset>
                            <legend>New Renting dates inputs</legend>
                            <section >
                                <RangeDaysPicker />
                            </section>
                        </fieldset>
                        <button id="rentFormButton" type="button" className="btn btn-success" onClick={submit}>Click to submit</button>
                    </form>);
                }
            })()}
        </main>
    )
}
