import React from 'react';
import './App.css';
import LoadEvent from './LoadEvent';

class App extends React.Component { //uso una classe per le props per fare la ajax

  state = {
    name: "",
    surname: "",
    age: "",
    nameError: "",
    surnameError: "",
    ageError: ""
  }

  doAjax = () =>
  {
                        
    var obj = `{
      "name": "${this.state.name}" ,
      "surname": "${this.state.surname}",
      "age": "${this.state.age}"
   }`;
       var xhr = new XMLHttpRequest();
       xhr.open("POST", "http://localhost:8000", true);
       xhr.setRequestHeader('Content-Type', 'application/json');
       xhr.onload = function() {
           if (this.response == 200)
               console.log(this.responseText);
       }
       xhr.onerror = function() {
           console.log(this.response);
           console.log("Error ....");
       }
       xhr.send(obj);
  }

  validate = () => 
  {
    let count = 0;
    let nameError = '';
    let surnameError = '';
    let ageError = '';
    if(this.state.name == '')
    {
      nameError = 'Please fill out this space';
      this.setState({nameError});
      count++;
    }
    if(this.state.surname == '')
    {
      surnameError = 'Please fill out this space';
      this.setState({surnameError});
      count++;
    }
      //devo trovare un altro modo per capire se l'input è o no un numero
    if( this.state.age == '')
    {
      ageError = "Please insert age correctly"
      this.setState({ageError});
      count++;
    }

    if(count > 0)
      return false;
    else
      return true;
  }

  handleChange = event => {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  };
  
  handleSubmit  = event => 
  {
    //event.preventDefault();
    console.log("porcodio");
    if(this.validate())
      console.log("dai dio cane");
      this.doAjax();
  };

  render()
  {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-end">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Register</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span> 
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" > 
          <ul className="navbar-nav ">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" tabIndex="-1" >Diocane</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>


    <div className="container-fluid bg-dark text-light text-center p-5">
      <div className="d-flex justify-content-center align-items-center">
        
      <div className="diocane">
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
      
                  <input onChange={this.handleChange} name="name" placeholder='John' className="form-control" id="name" aria-describedby="emailHelp" />
                </div>
                <div style={{fontSize: 12, color: 'red'}}>{this.state.nameError}</div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">Surname</label>
                  <input onChange={this.handleChange} name="surname" placeholder='Doe' className="form-control" id="surname" />
                </div>
                <div style={{fontSize: 12, color: 'red'}}>{this.state.surnameError}</div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Age</label>
                    <input onChange={this.handleChange} name="age" placeholder='50'className="form-control" id="age" />
                  </div>
                  <div style={{fontSize: 12, color: 'red'}}>{this.state.ageError}</div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" htmlFor="exampleCheck1">I read and agree with <a id="privacy" href="#"> privacy terms</a> </label>
                </div>
                <button  onClick={this.handleSubmit} id="button" className="btn btn-primary">Register</button>

            </div>
      </div>
      
    </div>
    
    <footer  className="container-fluid  py-5 px-5 px-md-5 bg-primary mt-auto">
      
  
    </footer>
    </>
  );
  }
}

export default App;
