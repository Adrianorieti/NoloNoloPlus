import React, { Component } from 'react';
import './App.css';
import treehd from './images/treehd.jpg'
import CarouselContainer from './components/Carousel';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import {Route, Switch} from 'react-router-dom';
import RentForm from './components/RentForm';

class App extends React.Component {


  render (){

    return(
    <div> 

      <Navbar logoName="NoloNoloPlus" />

      <Switch>

      <Route path="/" exact>
      <Banner />
      


      <div className="bg-image" >
      <RentForm />
      </div>

      <div>
        <CarouselContainer />
      </div>
      </Route>

      <Route path="/login">
      <div className="bg-image" ></div>

      </Route>

      </Switch>
        
      
    </div>
  );

  }
}

export default App;