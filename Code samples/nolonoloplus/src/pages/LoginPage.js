import React from "react";

class LoginPage extends React.Component {
  state = {
    firstName: "",
    secondName: "",
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
    firstnameError: "",
    secondnameError: "",
    phoneError: "",
    emailError: "",
    passwordError: "",
    repeatpassError: ""
  }

  /* Handler dei cambiamenti del testo nell'input*/
  handleChange = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  };

  doAjax = () => {
    //faccio l'encoding della password in base64 perchè così non ho problemi con caratteri strani
    const buff = Buffer.from(this.state.password, 'utf-8');
    const encodedpass = buff.toString('base64');


    //creo il json che rappresenta lo schema del database con i dati  
    var obj = `{
      "name": "${this.state.firstName}" ,
      "surname": "${this.state.secondName}",
      "phone": "${this.state.phone}",
      "email": "${this.state.email}",
      "password": "${encodedpass}"
   }`;
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

  /*Valida l'input per vedere se ci sono problemi,  BETA VERSION */
  validate = () => {
    let count = 0;
    let firstnameError = '';
    let secondnameError = '';
    let phoneError = '';
    let passwordError = '';
    let emailError = '';
    let repeatpassError = '';
    const paswd = '/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ ';
    const mailformat = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ';

    if (this.state.firstName === '') {
      firstnameError = 'Please fill out this space';
      this.setState({ firstnameError });
      count++;
    }
    if (this.state.secondName === '') {
      secondnameError = 'Please fill out this space';
      this.setState({ secondnameError });
      count++;
    }
    //devo trovare un altro modo per capire se l'input è o no un numero
    if (this.state.phone === '' || this.state.phone.length != 10) {
      phoneError = "Please insert phone correctly";
      this.setState({ phoneError });
      count++;
    }
    if (this.state.password === '' || this.state.password.match(paswd)) {
      passwordError = "Password must contain a number and a symbol and a length between 7 to 15 characters";
      this.setState({ passwordError });
      count++;
    }
    if (this.state.email === '' || this.state.email.match(mailformat)) {
      emailError = "Email syntax is not valid";
      this.setState({ emailError });
      count++;
    }
    if (this.state.repeatPassword != this.state.password) {
      repeatpassError = " Passwords don't matches";
      this.setState({ repeatpassError });
      count++;
    }

    if (count > 0)
      return false;
    else
      return true;
  }

  /* Handler che entra in gioco quando il pulsante di register è premuto*/
  handleRegister = event => {
    event.preventDefault();
    if (this.validate()) {
      console.log("Eseguito");
      this.doAjax();
    }
  };
  /* Handler che entra in gioco quando il pulsante di login è premuto*/

  handleLogin = event => {
    event.preventDefault();
    const paswd = '/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ ';
    const mailformat = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ';
    if ((this.state.email === '' || this.state.email.match(mailformat)) && (this.state.password === '' || this.state.password.match(paswd)))
     {
      
        console.log('basta fare il coglione e inserisci le cose');
      
      } else { 

      const buff = Buffer.from(this.state.password, 'utf-8');
      const encodedpass = buff.toString('base64');
      const obj = `{
        "email": "${this.state.email}",
        "password": "${encodedpass}"
      }`;

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/login", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status == 200) {
          //console.log(this.responseText);
          console.log("Logged in correctly");
          
          //qui dobbiamo mandare l'utente dove stava andando, se stava semplicemente facendo login
          //lo rimandiamo alla home, se stava prenotando ma non era loggato dobbiamo ricordare l'ultima pagina dove stava andando
          //credo si possa fare con react
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
            <div>
              <div className="mb-3">
                <label for="loginemail" className="form-label">Email address</label>
                <input onChange={this.handleChange} type="email" className="form-control" name="email" id="loginemail" aria-describedby="emailHelp" aria-required="true" />
                <label id='loginmail-error' for="loginemail" style={{ fontSize: 12, color: 'red' }}></label>

              </div>
              <div className="mb-3">
                <label for="loginpassword" className="form-label">Password</label>
                <input onChange={this.handleChange} type="password" className="form-control" name="password" id="loginpassword" aria-required="true" />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Remember me</label>
              </div>
              <input onClick={this.handleLogin} type="submit" className="btn btn-primary" value="Login"></input>
            </div>


          </div>

          <div className="tab-pane fade register" id="profile" role="tabpanel" aria-labelledby="profile-tab">

            <div>
              <div className="mb-3">
                <label for="firstName" className="form-label">First Name</label>
                <input onChange={this.handleChange} id="firstName" type="text" className="form-control" name="firstName"
                  aria-describedby="emailHelp" placeholder="John" aria-required="true" />
                <label for="firstName" style={{ fontSize: 12, color: 'red' }}>{this.state.firstnameError}</label>
              </div>

              <div className="mb-3">
                <label for="secondName" className="form-label">Second name</label>
                <input onChange={this.handleChange} id="secondName" type="text" className="form-control" name="secondName"
                  aria-describedby="emailHelp" placeholder="Doe" aria-required="true" />
                <label for="secondName" style={{ fontSize: 12, color: 'red' }}>{this.state.secondnameError}</label>
              </div>

              <div className="mb-3">
                <label for="email" className="form-label">Email</label>
                <input onChange={this.handleChange} id="email" type="email" className="form-control" name="email"
                  placeholder="username@studio.unibo.it" aria-required="true" />
                <label id='mail-error' for="email" style={{ fontSize: 12, color: 'red' }}>{this.state.emailError}</label>
              </div>

              <div className="mb-3">
                <label for="phone" className="form-label">Phone Number</label>
                <input onChange={this.handleChange} id="phone" type="text" className="form-control" name="phone" aria-required="true" />
                <label for="phone" style={{ fontSize: 12, color: 'red' }}>{this.state.phoneError}</label>
              </div>

              <div className="mb-3">
                <label for="password" className="form-label">Password</label>
                <input onChange={this.handleChange} id="password" type="password" className="form-control" name="password" aria-required="true" />
                <label for="password" style={{ fontSize: 12, color: 'red' }}>{this.state.passwordError}</label>
              </div>

              <div className="mb-3">
                <label for="repeatPassword" className="form-label">Repeat Password</label>
                <input onChange={this.handleChange} id="repeatPassword" type="password" className="form-control" name="repeatPassword" aria-required="true" />
                <label for="repeatPassword" style={{ fontSize: 12, color: 'red' }}>{this.state.repeatpassError}</label>
              </div>

              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Remember me</label>
              </div>

              <input onClick={this.handleRegister} type="submit" className="btn btn-primary" value="Register" ></input>
            </div>
          </div>
        </div>

      </div>

    );
  }
}
export default LoginPage;