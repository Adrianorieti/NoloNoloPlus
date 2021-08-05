import React, { Component } from 'react';
import './App.css';
import treehd from './treehd.jpg'
import CarouselContainer from './component';
import Footer from './footer';

class App extends React.Component {


  render() {

    return (
      <div>
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

        <div className="img-responsive"></div>

        <div className="bg-image" >

        </div>


        <div>
          <CarouselContainer />
        </div>

        <section className="footer">
          <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
            locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
            copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />
        </section>

      </div>
    );

  }
}

export default App;