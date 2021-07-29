import React, { Component } from 'react';
import './App.css';
import treehd from './treehd.jpg'
import CarouselContainer from './component';

class App extends React.Component {


  render (){

    return(
     <> 
      <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">NoloNolo</a>
        <button className="navbar-toggler custom-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon "></span> 
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" > 
          <ul className="navbar-nav ">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Login/Register</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" tabIndex="-1" >Contacts</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
 
      <div className="bg-image" style={{
          backgroundImage: 'url('+ treehd+') ' ,
          height: "100vh",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',

        }} >
<center><h1><font face="Arial" color="white">Travelling with us you can smell the world</font></h1></center>
      </div>
      <div>
        <CarouselContainer />
      </div>
 
      </>
  );

  }
}

export default App;