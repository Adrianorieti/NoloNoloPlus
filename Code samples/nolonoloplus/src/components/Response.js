import React from 'react';
import { useEffect, useState} from "react";
import Spinner from './Spinner';
import { useHistory } from "react-router";
import { chooseImage } from '../functions/helper';

function Response(props){

    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        console.log("sono dentro response !");
       
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
            const url = `http://localhost:8001/api/pending/${name}`;
           
            fetch(url, options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then((data) =>{
                console.log(data);
            }).catch(error => {
                console.log(error.message);
            });
        }
        let token = JSON.parse(sessionStorage.getItem('token'));

        if(token)
            addPendingRequest(token);
        
    },[])
    

    return(<div>
        {loading ? <Spinner /> : <p>Arrivo arrivo n'attimo</p>}
        </div>
    )
}


export default Response;