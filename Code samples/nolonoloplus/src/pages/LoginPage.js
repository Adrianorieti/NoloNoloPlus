import React from "react";

class LoginPage extends React.Component
{
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

  doAjax = () =>
  {
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
       xhr.onload =  function() {
           if (xhr.status == 200)
           {
               //console.log(this.responseText);
               console.log("daiiiiiiiiiiiiiiiiiiiiii");
           }
           else if(xhr.status == 500)
            {
              console.log("La mail esiste già");
              document.getElementById('mail-error').innerHTML = "Mail already in use BOOMER";
            }
       }
       xhr.onerror = function() {
           console.log(this.response);
           console.log("Error ....");
       }
       xhr.send(obj);
  };

/*Valida l'input per vedere se ci sono problemi,  BETA VERSION */
  validate = () => 
  {
    let count = 0;
    let firstnameError = '';
    let secondnameError = '';
    let phoneError = '';
    let passwordError= '';
    let emailError = '';
    let repeatpassError= '';
    var paswd= '/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ ';
    var mailformat = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ';

    if(this.state.firstName === '')
    {
      firstnameError = 'Please fill out this space';
      this.setState({firstnameError});
      count++;
    }
    if(this.state.secondName === '')
    {
      secondnameError = 'Please fill out this space';
      this.setState({secondnameError});
      count++;
    }
      //devo trovare un altro modo per capire se l'input è o no un numero
    if( this.state.phone === '' || this.state.phone.length != 10)
    {
      phoneError = "Please insert phone correctly";
      this.setState({phoneError});
      count++;
    }
    if(this.state.password === '' || this.state.password.match(paswd) )
    {
      passwordError = "Password must contain a number and a symbol and a length between 7 to 15 characters";
      this.setState({passwordError});
      count++;
    }
    if(this.state.email === '' || this.state.email.match(mailformat))
    {
      emailError = "Email syntax is not valid";
      this.setState({emailError});
      count++;
    }
    if(this.state.repeatPassword != this.state.password)
    {
      repeatpassError = " Passwords don't matches";
      this.setState({repeatpassError});
      count++;
    }

    if(count > 0)
      return false;
    else
      return true;
  }

  /* Handler che entra in gioco quando il pulsante di register è premuto*/
  handleRegister  = event => 
  {
    event.preventDefault();
    if(this.validate())
    {
      console.log("Eseguito");
      this.doAjax();
    }
  };



    render()
    {
      return(
    
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
              <label for="exampleInputEmail1" className="form-label">Email address</label>
              <input  onChange={this.handleChange} type="email" className="form-control" id="loginemail" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Password</label>
              <input onChange={this.handleChange} type="password" className="form-control" id="loginpassword" />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" />
              <label className="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            <button onClick={this.handleLogin} type="submit" className="btn btn-primary">Login</button>
          </div>
    
    
        </div>
    
        <div className="tab-pane fade register" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    
          <div>
            <div className="mb-3">
              <label for="firstName" className="form-label">First Name</label>
              <input onChange={this.handleChange} type="text" className="form-control" name="firstName" aria-describedby="emailHelp" placeholder="John Doe" />
            </div>
            <div style={{fontSize: 12, color: 'red'}}>{this.state.nameError}</div>
            <div className="mb-3">
              <label for="secondName" className="form-label">Second name</label>
              <input onChange={this.handleChange} type="text" className="form-control" name="secondName" aria-describedby="emailHelp" placeholder="John Doe" />
            </div>

            <div style={{fontSize: 12, color: 'red'}}>{this.state.secondnameError}</div>

            <div className="mb-3">
              <label for="email" className="form-label">Email</label>
              <input  onChange={this.handleChange} type="email" className="form-control" name="email" placeholder="diocane@studio.unibo.it" />
            </div>

            <div id='mail-error' style={{fontSize: 12, color: 'red'}}>{this.state.emailError}</div>
            
            <div className="mb-3">
              <label for="phone" className="form-label">Phone Number</label>
              <input onChange={this.handleChange} type="text" className="form-control" name="phone" />
            </div>

            <div style={{fontSize: 12, color: 'red'}}>{this.state.phoneError}</div>

            <div className="mb-3">
              <label for="password" className="form-label">Password</label>
              <input onChange={this.handleChange} type="password" className="form-control" name="password" />
            </div>
            <div style={{fontSize: 12, color: 'red'}}>{this.state.passwordError}</div>

            <div className="mb-3">
              <label for="repeatPassword" className="form-label">Repeat Password</label>
              <input  onChange={this.handleChange} type="password" className="form-control" name="repeatPassword" />
            </div>
            <div style={{fontSize: 12, color: 'red'}}>{this.state.repeatpassError}</div>

            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" />
              <label className="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            <button onClick={this.handleRegister} type="submit" className="btn btn-primary">Register</button>
          </div>
    
    
        </div>
      </div>

      </div>
      
     );
  }
}
export default LoginPage;