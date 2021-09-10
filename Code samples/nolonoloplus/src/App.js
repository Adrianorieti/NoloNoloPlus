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
import Test from './components/Test';


function App (){
//Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
const [data, setData] = useState('');
const [isLogged, setLog] = useState('');

const nameToParent = (childdata) => {
  setData(childdata);
  // setData(JSON.parse(localStorage.getItem('username')));
}
const checkLog = (isLogged) => {
  setLog(isLogged);
  //  setLog(JSON.parse(localStorage.getItem('isLogged')));
}

  

    return(
      <div>

       
          <Navbar logoName="NoloNoloPlus" name={ sessionStorage.getItem('username') ? JSON.parse(sessionStorage.getItem('username')) : "Login/Register"} display={ isLogged ? 'true' : 'false' } />

        <Switch>

          <Route path="/" exact>



            <div className="bg-image" >

            
              <RentForm />

            </div>

            <div>
              <CarouselContainer />
            </div>

          </Route>

          <Route path="/login">  
          <LoginPage nameToParent={nameToParent} checkLog={checkLog} />
          </Route>

          <Route path="/test">
            
            <Test />

          </Route>

        </Switch>
        
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />

      
      </div>
    );

  }


export default App;