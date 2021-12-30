import React from 'react';
import { useEffect, useState} from "react";
import Product from '../components/Product';
import Spinner from '../components/Spinner';
import './style/hypothesis.css';
function Hypothesis()
{
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [token, setToken] = useState('');
    
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
            console.log("sono qui");
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    return response.json();
                }
                }).then((data) =>{
                    console.log("dentro data");
                    setLoading(false);
                    setCategory(data.category);
                    setPrice(data.finalPrice);
                    setToken(tokn);
                    setAvailable(true);
            }).catch(error => {
                setAvailable(false);
                console.log(error);
              });
        }
        let query = JSON.parse(sessionStorage.getItem('form_obj'));
        let tokn = JSON.parse(sessionStorage.getItem('token'));
        if(query)
            getAvailability(tokn, query);
        
    },[])

    return(<div className="main">
        {loading ? <Spinner /> : (available ? (
        <div>
            <div id="avail"><p>Available!</p></div>
            <Product products={category} price={price} />
        </div>
        )
         :  
         <div id="notavail">
            <p>Non disponibile</p></div>)}
         </div>
    );
}


export default Hypothesis;