import React from 'react';
import { useEffect } from 'react';
function About()
{
    useEffect(() => {
        document.getElementById('main').scrollIntoView({behavior: "smooth"})
      },[])
    return(
        <div id="main">
            <h3>Who we are</h3>
            <p><b>NoloNoloPlus</b> is a rental agency specialized in green movement.</p>
            <p>Our history begin in the far 1990 in this amazing territory.</p>
            <p>Our goal is always been and always will be the merge of our two passions,</p>
            <p>respect for the nature and enjoy life toghether with the people we love.</p>
            
        </div>
    )// inserire le regole dei punti fedeltà e un pò di come funziona tutto il
    //processo di noleggio e rendere carina la paginazione
}


export default About;