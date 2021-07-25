import React from 'react';
import './App.css';

function App() {
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
              <a className="nav-link" href="#" tabindex="-1" >Diocane</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>


    <div className="container-fluid bg-dark text-light text-center p-5">
      <div className="d-flex justify-content-center align-items-center">
        
      <div className="diocane">
                <div className="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Name</label>
                  <div id="error"></div>
                  <input  className="form-control" id="name" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">Surname</label>
                  <input  className="form-control" id="surname" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Age</label>
                    <input  className="form-control" id="age" />
                  </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" for="exampleCheck1">I read and agree with <a id="privacy" href="#"> privacy terms</a> </label>
                </div>
                <button  id="button" className="btn btn-primary">Register</button>
            </div>
      </div>
      
    </div>
    
    <footer  classNameName="container-fluid  py-5 px-5 px-md-5 bg-primary mt-auto">
      
  
    </footer>
    </>
  );
}

export default App;
