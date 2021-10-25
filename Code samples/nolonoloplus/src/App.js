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
import Products from './components/Products';
import UpdatePage from './pages/UpdatePage';
import PersonalPage from './pages/PersonalPage'



function App() {

  //Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('username')) || '');
  const [query, setQuery] = useState(null);

  const nameToParent = (childdata) => {
    setData(childdata);
  }

  const queryToParent = (rentFormData) => {
    setQuery(rentFormData);
  }


  return (

    <div>
      <Switch>

        <Route path="/" exact>
          <Navbar name={data} queryToParent={queryToParent} />

          <div className="bg-image" >


            <RentForm queryToParent={queryToParent} />

          </div>

          {/* <div>
              <CarouselContainer />
            </div> */}

        </Route>

        <Route path="/login" exact>
          <Navbar name={data} queryToParent={queryToParent} />

          <LoginPage nameToParent={nameToParent} />

        </Route>

        <Route path="/personalpage" exact>

          <Navbar name={data} queryToParent={queryToParent} />
          <PersonalPage />

        </Route>

        <Route path="/updatepage" exact>

          <Navbar name={data} queryToParent={queryToParent} />
          <UpdatePage nameToParent={nameToParent} />

        </Route>

        <Route path="/dashboard" exact>

          <Test />

        </Route>

        <Route path='/products' exact>

          <Navbar name={data} queryToParent={queryToParent} />

          <Products query={query} />

        </Route>


      </Switch>

      {/* <Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini"
         locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80"
         copyright="nolonoloplus" />
       */}
    </div>
  );

}


export default App;