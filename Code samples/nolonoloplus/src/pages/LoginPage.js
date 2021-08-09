import React from "react";
import {Redirect} from 'react-router-dom';

class LoginPage extends React.Component {
  state = {
    firstName: "",
    secondName: "",
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
    repeatpassError: ""
  }

  /* Handler dei cambiamenti del testo nell'input*/
  handleChange = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  };

  createObj = (operation) => {
    //faccio l'encoding della password in base64 perchè così non ho problemi con caratteri strani
    const buff = Buffer.from(this.state.password, 'utf-8');
    const encodedpass = buff.toString('base64');

    //creo il json che rappresenta lo schema del database con i dati 
    if (operation === 'register') {
      return (`{
      "name": "${this.state.firstName}" ,
      "surname": "${this.state.secondName}",
      "phone": "${this.state.phone}",
      "email": "${this.state.email}",
      "password": "${encodedpass}"
      }`);
    }
    else {
      return `{
        "email": "${this.state.email}",
        "password": "${encodedpass}"
        }`;
    }
  }

  doAjax = () => {
    const obj = this.createObj('register')
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
  passValidate = () => {
    if (this.state.repeatPassword != this.state.password) {
      let repeatpassError = " Passwords don't matches";
      this.setState({ repeatpassError });
      
      return false;
    }
    return true;
  }

  /* Handler che entra in gioco quando il pulsante di register è premuto*/
  handleRegister = event => {
    event.preventDefault();
    if (this.passValidate()) {
      console.log("Eseguito");
      this.doAjax();
    }
  };

  handleLogin = event => {
    event.preventDefault();
    const obj = this.createObj('login');

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status == 200) {
        console.log("Logged in correctly");
        const name = (JSON.parse(xhr.responseText)).name;
        document.querySelector('#navLoginReg').textContent = name;
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
  }




  render() {
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
            <form onSubmit={this.handleLogin}>
              <div className="mb-3">
                <label for="loginemail" className="form-label">Email address</label>
                <input onChange={this.handleChange} type="email" className="form-control" name="email" id="loginemail" aria-describedby="emailHelp"
                  required="required" placeholder="nomeutente@gmail.com" pattern="^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$" />
                <label id='loginmail-error' for="loginemail" style={{ fontSize: 12, color: 'red' }}></label>

              </div>
              <div className="mb-3">
                <label for="loginpassword" className="form-label">Password</label>
                <input onChange={this.handleChange} type="password" className="form-control" name="password" id="loginpassword"
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

            <form onSubmit={this.handleRegister}>
              <div className="mb-3">
                <label for="firstName" className="form-label">First Name</label>
                <input onChange={this.handleChange} id="firstName" type="text" className="form-control" name="firstName"
                  aria-describedby="emailHelp" placeholder="John" required="required" />
              </div>

              <div className="mb-3">
                <label for="secondName" className="form-label">Second name</label>
                <input onChange={this.handleChange} id="secondName" type="text" className="form-control" name="secondName"
                  aria-describedby="emailHelp" placeholder="Doe" required="required" />
              </div>

              <div className="mb-3">
                <label for="email" className="form-label">Email</label>
                <input onChange={this.handleChange} id="email" type="email" className="form-control" name="email"
                  placeholder="username@studio.unibo.it" required="required" pattern="^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$"
                  title="not valid email format" />
              </div>

              <div className="mb-3">
                <label for="phone" className="form-label">Phone Number</label>
                <input onChange={this.handleChange} id="phone" type="tel" className="form-control" name="phone" required="required"
                  pattern="[0-9]{10}" />
              </div>

              <div className="mb-3">
                <label for="password" className="form-label">Password</label>
                <input onChange={this.handleChange} id="password" type="password" className="form-control" name="password" required="required"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password must contain a number, a capital letter and a length of at least 8 characters" />
              </div>

              <div className="mb-3">
                <label for="repeatPassword" className="form-label">Repeat Password</label>
                <input onChange={this.handleChange} id="repeatPassword" type="password" className="form-control" name="repeatPassword"
                  required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
                <label for="repeatPassword" style={{ fontSize: 12, color: 'red' }}>{this.state.repeatpassError}</label>
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
}
export default LoginPage;