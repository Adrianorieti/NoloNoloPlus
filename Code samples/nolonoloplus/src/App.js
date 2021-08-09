import React, { Component } from 'react';
import './App.css';
import treehd from './images/treehd.jpg'
import CarouselContainer from './components/Carousel';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import { Route, Switch } from 'react-router-dom';
import RentForm from './components/RentForm';
import LoginPage from './pages/LoginPage';
import RegisterForm from './components/Register';
import Footer from './components/Footer';

class App extends React.Component {


  render() {

    return (
      <div>

       
                  
          <Navbar logoName="NoloNoloPlus" name="Login/Register" />

        <Switch>

          <Route path="/" exact>



            <div className="bg-image" >

              <Banner />


              <RentForm />

            </div>

            <div>
              <CarouselContainer />
            </div>

          </Route>

          <Route path="/login">
            <div className="bg-image loginpage" >
              <LoginPage />
            </div>

          </Route>

        </Switch>
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />

      
      </div>
    );

  }
}

export default App;