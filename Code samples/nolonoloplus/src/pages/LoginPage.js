import React, { useState } from "react";
import {Redirect} from 'react-router-dom';





function LoginPage (){
  //TO-DO usare hooks come useState
  const [firstName, setfirstName] = useState('');
  const [secondName, setsecondName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [repeatPassword, setrepeatPassword] = useState('');
  const [repeatpassError, setrepeatpassError] = useState('');

  /* Handler dei cambiamenti del testo nell'input*/
function handleChange(event){
  console.log(event.target.name);
  
  switch (event.target.name){
    case firstName:
      setfirstName(event.target.value);
      break; 
    case secondName:
      setsecondName(event.target.value);
      break; 
    case phone:
      setphone(event.target.value);
      break; 
    case email:
      setemail(event.target.value);
      break; 
    case password:
      setpassword(event.target.value);
      break; 
    case repeatPassword:
      setrepeatPassword(event.target.value);
      break; 
    case repeatpassError:
      setrepeatpassError(event.target.value);
  }
};


function createObj (operation)  {
    //faccio l'encoding della password in base64 perchè così non ho problemi con caratteri strani
    const buff = Buffer.from(password, 'utf-8');
    const encodedpass = buff.toString('base64');
  
    //creo il json che rappresenta lo schema del database con i dati 
    if (operation === 'register') {
      return (`{
      "name": "${firstName}" ,
      "surname": "${secondName}",
      "phone": "${phone}",
      "email": "${email}",
      "password": "${encodedpass}"
      }`);
    }
    else {
      return `{
        "email": "${email}",
        "password": "${encodedpass}"
        }`;
    }
};
  
  
  function doAjax () {
    const obj = createObj('register')
    //creo l'oggetto ajax per la post
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status == 200) {
        //console.log(this.responseText);
        console.log("daiiiiiiiiiiiiiiiiiiiiii");
      }
      else if (xhr.status == 500) {
        console.log("La mail esiste già");
        document.getElementById('mail-error').innerHTML = "Mail already in use BOOMER";
      }
    }
    xhr.onerror = function () {
      console.log(this.response);
      console.log("Error ....");
    }
    xhr.send(obj);
};

/*Confronta la password immessa e quella ripetuta.
  Ritorna false se sono diferse, true se uguali. */
function passValidate() 
{
    if (repeatPassword != password) {
      setrepeatpassError(" Passwords don't matches");  
      return false;
    }
    return true;
};

  
/* Handler che entra in gioco quando il pulsante di register è premuto*/
function handleRegister (event) {
  event.preventDefault();
  if (passValidate()) {
    console.log("Eseguito");
    doAjax();
  }
};

 function handleLogin(event){
    
    
    const obj = createObj('login');

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status == 200) {
        console.log("Logged in correctly");
        const username = (JSON.parse(xhr.responseText)).name;
        
        //TO-DO
        //<Redirect to='/' />
        //document.querySelector('#navLoginReg').textContent = name;
        //history.push('https://www.google.com');
      }
      else if (xhr.status == 500) {

        document.getElementById('loginmail-error').innerHTML = "Mail or password is wrong !";

      }
    }
    xhr.onerror = function () {
      console.log(this.response);
      console.log("Error ....");
    }
    xhr.send(obj);
};




  
    return (

      <div className="login" scrolling="auto">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Login</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Register</button>
          </li>

        </ul>

        <div className="tab-content" id="myTabContent">

          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label for="loginemail" className="form-label">Email address</label>
                <input onChange={handleChange} type="email" className="form-control" name="email" id="loginemail" aria-describedby="emailHelp"
                  required="required" placeholder="nomeutente@gmail.com" pattern="^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$" />
                <label id='loginmail-error' for="loginemail" style={{ fontSize: 12, color: 'red' }}></label>

              </div>
              <div className="mb-3">
                <label for="loginpassword" className="form-label">Password</label>
                <input onChange={handleChange} type="password" className="form-control" name="password" id="loginpassword"
                  required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Remember me</label>
              </div>
              <input type="submit" className="btn btn-primary" value="Login"></input>
            </form>


          </div>

          <div className="tab-pane fade register" id="profile" role="tabpanel" aria-labelledby="profile-tab">

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label for="firstName" className="form-label">First Name</label>
                <input onChange={handleChange} id="firstName" type="text" className="form-control" name="firstName"
                  aria-describedby="emailHelp" placeholder="John" required="required" />
              </div>

              <div className="mb-3">
                <label for="secondName" className="form-label">Second name</label>
                <input onChange={handleChange} id="secondName" type="text" className="form-control" name="secondName"
                  aria-describedby="emailHelp" placeholder="Doe" required="required" />
              </div>

              <div className="mb-3">
                <label for="email" className="form-label">Email</label>
                <input onChange={handleChange} id="email" type="email" className="form-control" name="email"
                  placeholder="username@studio.unibo.it" required="required" pattern="^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$"
                  title="not valid email format" />
              </div>

              <div className="mb-3">
                <label for="phone" className="form-label">Phone Number</label>
                <input onChange={handleChange} id="phone" type="tel" className="form-control" name="phone" required="required"
                  pattern="[0-9]{10}" />
              </div>

              <div className="mb-3">
                <label for="password" className="form-label">Password</label>
                <input onChange={handleChange} id="password" type="password" className="form-control" name="password" required="required"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password must contain a number, a capital letter and a length of at least 8 characters" />
              </div>

              <div className="mb-3">
                <label for="repeatPassword" className="form-label">Repeat Password</label>
                <input onChange={handleChange} id="repeatPassword" type="password" className="form-control" name="repeatPassword"
                  required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
                <label for="repeatPassword" style={{ fontSize: 12, color: 'red' }}>{repeatpassError}</label>
              </div>

              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Remember me</label>
              </div>

              <input type="submit" className="btn btn-primary" value="Register" ></input>
            </form>
          </div>
        </div>

      </div>

    );
}

export default LoginPage;