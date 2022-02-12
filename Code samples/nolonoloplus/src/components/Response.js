import React from 'react';
import { useEffect, useState} from "react";
import Spinner from './Spinner';
import { useHistory } from "react-router";
import { chooseImage } from '../functions/helper';
import './style/response.css';
function Response(props){

    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const history = useHistory();
  
    useEffect(() => 
    {
        
        function addPendingRequest(token)
        {
            let toSend =`{
                "price": "${props.price}",
                "start": "${props.start}",
                "end": "${props.end}"
            }`;
            console.log(toSend);
            const options = {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json','Authorization': `Bearer ${token}` }),
                body: toSend
            };
            let name = props.product.name;
            const url = `http://site202145.tw.cs.unibo.it/api/pending/${name}`;
           
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then((data) =>{
                console.log(data);
                setConfirmed(true);
                setLoading(false);

            }).catch(error => {
                setLoading(false);
                console.log(error.message);
            });
        }
        let token = JSON.parse(sessionStorage.getItem('token'));

        if(token)
            addPendingRequest(token);
        
    },[])
    

    return(<div>
        {loading ? <Spinner /> 
        : 
        (confirmed ? <div id="avail">
            <h4>Thank you for your reservation !</h4>
            <p>An employee will as soon as possible check for your rental.</p>
            <p>When accepted, the rental is goint to be visible on your <a id="personalpage" href="http://site202145.tw.cs.unibo.it/personalpage"> personal page</a></p>
        </div> 
        :
         <div id="notavail">
             <h4>An error occurred</h4>
            <p>Probably there is no more availability on the choosen category</p>
            <p>Please try again later</p>
         </div>)}
        </div>
    )
}


export default Response;