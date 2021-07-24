import React from 'react';

function Prova(){

    const add = () =>{      //funzione ausiliaria di prova()
        console.log("Mani in alto questa è una prova");
    }

    return( //quello che ritorna prova() quando viene invocata da app
        <button onClick={add}> dio </button>
        )
};


export default Prova; //importante altrimenti non viene visto all'esterno