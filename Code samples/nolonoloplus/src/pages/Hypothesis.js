import React from 'react';
import { useEffect, useState} from "react";
import { useHistory } from "react-router";
import Product from '../components/Product';

function Hypothesis()
{
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    
    useEffect(() => 
    {
        function getAvailability(tokn, query)
        {
            const options = {
                method: 'GET',
                headers: new Headers({'Authorization': `Bearer ${tokn}` })
              };
              let name = query.name;
              let start = query.startingDate;
              let end = query.endingDate;
            const url = `http://localhost:8001/api/categories/${name}/available/?start=${start}&end=${end}`;
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                }).then((data) =>{
                    setLoading(false);
                    setProduct(data.product);
                    setPrice(data.price);
                    setAvailable(true);
                    console.log(data.product);

                console.log(data);
            }).catch(error => {
                setAvailable(false);
                console.log(error);
              });
        }
        let query = JSON.parse(sessionStorage.getItem('form_obj'));
        let tokn = JSON.parse(sessionStorage.getItem('token'));
        getAvailability(tokn, query);
    },[])

//TO-DO aggiungere uno spinner AL POSTO DI ATTENDI
    return(<div className="main">
        {loading ? <p>Attendi</p> : (available ? <p>Disponibile</p> : <p>Non disponibile</p>)}
    </div>
    );
}


export default Hypothesis;