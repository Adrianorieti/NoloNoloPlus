import React, { useState } from "react";
import { useHistory } from "react-router";


function LoginPage({ nameToParent }) {

  let history = useHistory();
  const [firstName, setfirstName] = useState('');
  const [secondName, setsecondName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [repeatPassword, setrepeatPassword] = useState('');
  const [repeatpassError, setrepeatpassError] = useState('');

  /* Handler dei cambiamenti del testo nell'input*/
  function handleChange(event) {


    switch (event.target.name) {
      case 'firstName':
        setfirstName(event.target.value);
        break;
      case 'secondName':
        setsecondName(event.target.value);
        break;
      case 'phone':
        setphone(event.target.value);
        break;
      case 'email':
        setemail(event.target.value);
        break;
      case 'password':
        setpassword(event.target.value);
        break;
      case 'repeatPassword':
        setrepeatPassword(event.target.value);
        break;
      case 'repeatpassError':
        setrepeatpassError(event.target.value);
    }
  };

 /* Creates the json object to send */
  function createObj(operation) {

    // Password encoding to ensure escapes characters to be send without problems
    const buff = Buffer.from(password, 'utf-8');
    const encodedpass = buff.toString('base64');

  
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


  function doRegister() {

    const obj = createObj('register');

    const options = {
      method: 'POST',
      headers: new Headers({'Content-type': 'application/json'}),
      body: obj
    };
    let url = 'http://localhost:8001/api/register';

    fetch(url, options)
    .then(response => {
       if(response.status == 200)
       {
        console.log("Registrazione avvenuta con successo.");
        history.push('/login');
       }
       else if(response.status == 500){
        console.log("La mail esiste già");
        document.getElementById('registermail-error').innerHTML = "Mail already in use";
       }
    })
    .catch(error => {
      console.log(this.response);
      console.log("Error ....");
    });

  };

  /* Confronta la password immessa e quella ripetuta.
    Ritorna false se sono diferse, true se uguali. */
  function passValidate() {
    if (repeatPassword != password) {
      setrepeatpassError(" Passwords don't matches");
      return false;
    }
    return true;
  };


  /* Register Handler*/
  function handleRegister(event) {
    event.preventDefault();

    if (passValidate()) {
      console.log("Eseguito");
      doRegister();
    }
  };

  /* Login Handler */
function handleLogin(event) {

    event.preventDefault();

    const obj = createObj('login');

    const options = {
      method: 'POST',
      headers: new Headers({'Content-type': 'application/json'}),
      body: obj
    };
    
    let url = 'http://localhost:8001/api/login';

    fetch(url, options)
      .then(response =>{
        if(response.status == 200)
          return response.json();
        else
          document.getElementById('loginmail-error').innerHTML= "Mail or password incorrect.";
         }).then((data) =>
        {
        
        // Pass back to app.js the navbar 
        console.log(data.name);

        const username = data.name;
        
        const token = data.accessToken;

        sessionStorage.setItem("token", JSON.stringify(token));
                
        sessionStorage.setItem('username', JSON.stringify(username));

        nameToParent(username);
        
        history.push('/');

      }).catch(error => {
      console.log(error);
    });
  };





  return (
    <div className="bg-image loginpage" >
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
                  <label id='registermail-error' for="email" style={{ fontSize: 12, color: 'red' }}></label>

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
    </div>
  );
}

export default LoginPage;