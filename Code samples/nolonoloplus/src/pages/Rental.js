import React from 'react';
import { useEffect, useState} from "react";
import Spinner from '../components/Spinner';
import { useHistory } from "react-router";
import { chooseImage } from '../functions/helper';
import Response from '../components/Response';
import './style/rental.css';

function Rental(props)
{
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [available, setAvailable] = useState(false);
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [response, setResponse] = useState(false);
    const [product, setProduct] = useState();

    const history = useHistory();

    const goToAbout = () => {
        props.aboutToParent(true);
        history.push('/about');
    }

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
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                }).then((data) =>{
                    setCategory(data.category);
                    setPrice(data.availPrice);
                    setAvailable(data.available);
                    setProduct(data.product);
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
            {response ? <div><Response product={product} price={price} start={start} end={end}/></div> 
            :
             (loading ? <Spinner /> : (available ? (<div>
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
                        <p>Total Price: ${price}<span><a className="fa fa-info-circle"  onClick={goToAbout}></a></span></p>
                    </div>
                    <div id="control">
                        <button className="btn btn-success" onClick={() => {setResponse(true)}}>Confirm</button>
                        <a className="btn btn-warning" onClick={() => {history.push('/')}}>Go Back</a>
                    </div>
                </div>
                </div>

            </div> )
            :
            (<div id="notavail">
                No products available on those dates
                <a className="btn btn-warnign" onClick={() => {history.push('/')}}>Back</a>
            </div>)
             )
            )}
            </div>
);

}

export default Rental;