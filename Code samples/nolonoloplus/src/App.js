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




function App (){
  
//Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
const [data, setData] = useState( JSON.parse(sessionStorage.getItem('username')) || '');


const nameToParent = (childdata) => {
  setData(childdata);
}

  

    return(
    
         

       

        <Switch>

          <Route path="/" exact>
          <Navbar name={data}/>



            <div className="bg-image" >

            
              <RentForm />

            </div>

            <div>
              <CarouselContainer />
            </div>
            <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />
          

          </Route>

          <Route path="/login" exact>  
          <Navbar name={data}/>

          <LoginPage nameToParent={nameToParent} />
           
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />

          </Route>

          <Route path="/dashboard" exact>
            
            <Test />

          </Route>

        </Switch>
       
      
      
    );

  }


export default App;