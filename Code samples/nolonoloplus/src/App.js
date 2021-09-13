import React, { Component, useEffect } from 'react';
import './App.css';
import CarouselContainer from './components/Carousel';
import Navbar from './components/Navbar';
import { Route, Switch } from 'react-router-dom';
import RentForm from './components/RentForm';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import { useState } from 'react';
import Test from './components/Test';
import {AppContext} from './store/Context';




function App (){
  
//Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
const [data, setData] = useState( JSON.parse(sessionStorage.getItem('username')) || '');
const [isLogged, setLog] = useState(sessionStorage.getItem('isLogged') || false);


const nameToParent = (childdata) => {
  setData(childdata);
}

  

    return(
    
          <AppContext.Provider value={{ isLogged, setLog }}>

       
          <Navbar name={isLogged ? data : "Login/Register"}/>

        <Switch>

          <Route path="/" exact>



            <div className="bg-image" >

            
              <RentForm />

            </div>

            <div>
              <CarouselContainer />
            </div>

          </Route>

          <Route path="/login" exact>  
          <LoginPage nameToParent={nameToParent} />
          </Route>

          <Route path="/dashboard" exact>
            
            <Test />

          </Route>

        </Switch>
        
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />
  </AppContext.Provider>
      
      
    );

  }


export default App;