import React from 'react';
import { useEffect, useState} from "react";
import Spinner from '../components/Spinner';
import { useHistory } from "react-router";
import { chooseImage } from '../functions/helper';
import './style/rental.css';

function Rental()
{
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    const history = useHistory();

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
              setStart(start);
              let end = query.endingDate;
              setEnd(end);
            const url = `http://localhost:8001/api/categories/${name}/available/?start=${start}&end=${end}`;
            console.log("sono qui");
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                }).then((data) =>{
                    setCategory(data.category);
                    setPrice(data.finalPrice);
                    setAvailable(data.available);
                    setLoading(false);
            }).catch(error => {
                console.log(error.message);
              });
        }
        let query = JSON.parse(sessionStorage.getItem('form_obj'));
        let tokn = JSON.parse(sessionStorage.getItem('token'));
        if(query)
            getAvailability(tokn, query);
        
    },[])
    
    return(<div className="main">
            {loading ? <Spinner /> : (available ? (<div>
                <div id="summary">
                <div id="left">
                    {chooseImage(category.name)}
                </div>
                <div id="right">
                    <div id="title"><h4>Your rental summary</h4></div>
                    <div id="info">
                        <p>Name: {category.name}</p>
                        <p>Description: {category.description}</p>
                        <p>Start: {start}</p>
                        <p>End: {end}</p>
                        <p>Total Price: ${price}</p>
                    </div>
                    <div id="control">
                        <a className="btn btn-success" onClick={history.push('/rentalResponse')}>Confirm</a>
                        <a className="btn btn-warning" onClick={history.push('/')}>Go Back</a>
                    </div>
                </div>
                </div>

            </div> )
            :
            (<div id="notavail">
                No products available on those dates
                <a className="btn btn-warnign" onClick={history.push('/')}>Back</a>
            </div>)
             )
            }
            </div>
);

}

export default Rental;