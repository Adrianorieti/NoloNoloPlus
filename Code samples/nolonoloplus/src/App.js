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

const childToParent = (childdata) => {
  setData(childdata);
}

  

    return (
      <div>

       
  {/* Potrei passare la variabile childdata nella props.name di Navbar per farla vedere
  però è evidente che dobbiamo fare un check di un booleano */}
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

          <Route path="/login" component={() => <LoginPage childToParent={childToParent} />}>
        
          

          </Route>

        </Switch>
        
        <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
          locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
          copyright="NOLONOLOPLUS SRL INCAZZATISSIMI" />

      
      </div>
    );

  }


export default App;