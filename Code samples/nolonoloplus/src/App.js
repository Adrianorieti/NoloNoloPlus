import React, { Component } from 'react';
import './App.css';
import treehd from './images/treehd.jpg'
import CarouselContainer from './components/Carousel';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import { Route, Switch } from 'react-router-dom';
import RentForm from './components/RentForm';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import { useState } from 'react';


function App () {
//Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
const [data, setData] = useState('');
const [isLogged, setLog] = useState('');

const childToParent = (childdata, isLogged) => {
  setData(childdata);
  setLog(isLogged);
}

  

    return (
      <div>

       
  {/* Devo passare più props perchè a seconda che lo user sia autenticato o meno ho un comportamento diverso */}
          <Navbar logoName="NoloNoloPlus" name={isLogged ? data : "Login/Register"} display={isLogged ? true : false} />

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
          {/* <Navbar logoName="NoloNoloPlus" name={isLogged ? data : "Login/Register"} display={isLogged ? true : false} /> */}

          <LoginPage childToParent={childToParent} />
        
          

          </Route>

        </Switch>
        
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />

      
      </div>
    );

  }


export default App;