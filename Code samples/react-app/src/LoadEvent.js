import React from 'react';

function LoadEvent ()
{
    function event () {
           const name = document.getElementById('name').value;
           const surname = document.getElementById('surname').value;
           const age = document.getElementById('age').value;
            console.log(name);
                           
           var obj = `{
          "name": "${name}" ,
          "surname": "${surname}",
          "age": "${age}"
       }`;
           var xhr = new XMLHttpRequest();
           xhr.open("POST", "/", true);
           xhr.setRequestHeader('Content-Type', 'application/json');
           xhr.onload = function() {
               if (this.response == 200)
                   console.log(this.responseText);
           }
           xhr.onerror = function() {
               console.log("Error ....");
           }
           xhr.send(obj);
       
        }

        return(

            <button  onclick={event} id="button" className="btn btn-primary">Register</button>
        );
}


export default LoadEvent;