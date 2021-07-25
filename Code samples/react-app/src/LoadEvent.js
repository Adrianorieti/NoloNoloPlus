import React from 'react';

function LoadEvent ()
{
    
           const name = document.getElementById('name').value;
           const surname = document.getElementById('surname').value;
           const age = document.getElementById('age').value;

                           
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


export default LoadEvent;