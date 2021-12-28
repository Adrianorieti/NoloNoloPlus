import React from "react";
import './App.css';
import CarouselContainer from './components/Carousel';
import Header from './components/Header';
import Navbar from './components/Navbar';
import {
  Route,
  Switch
} from 'react-router-dom';
import RentForm from './components/RentForm';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import {
  useState
} from 'react';
import Test from './components/Test';
// import Products from './components/Products';
import Products from './pages/Products';
import UpdatePage from './pages/UpdatePage';
import PersonalPage from './pages/PersonalPage';
import NewUserPage from './pages/newUserPage';
import FutureReservations from './pages/FutureReservations';
import ModifyReservation from './pages/ModifyReservation';
import ActiveReservations from "./pages/ActiveReservations";
import PastReservations from "./pages/PastReservations";



function App() {

  //Uso questa roba per passarmi dati da LoginPage a qui e passarli quindi poi alla navbar come props
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('username')) || '');
  const [query, setQuery] = useState(null);
  const [reservation, setReservation] = useState('');

  const nameToParent = (childdata) => {
    setData(childdata);
  }

  const queryToParent = (rentFormData) => {
    setQuery(rentFormData);
  }

  const resToParent = (resData) => {
    setReservation(resData);
  }


  return (
    <div className="App" >
      {<Navbar name={data} queryToParent={queryToParent} />}
      <Switch>

        <Route path="/" exact >
          <Header />
          <div className="App-content bg-image container-fluid">
            <div className="row">
              <div className="col">
                <RentForm queryToParent={queryToParent} />
              </div>
              <div className="col">
                <h1 className="banner">We provide the mean <br /> you choose the place</h1>
              </div>
            </div>
          </div>

          {<div> <CarouselContainer /> </div>}

        </Route>

        <Route path="/login" exact >
          <LoginPage nameToParent={nameToParent} />
        </Route>

        <Route path="/personalpage" exact>
          <PersonalPage />

        </Route>

        <Route path="/newpersonalpage" exact>
          <NewUserPage />

        </Route>

        <Route path="/updatepage" exact>
          <UpdatePage nameToParent={nameToParent} />

        </Route>

        <Route path="/futurereservations" exact>
          <FutureReservations resToParent={resToParent} />
        </Route>

        <Route path="/activereservations" exact>
          <ActiveReservations />
        </Route>

        <Route path="/pastreservations" exact>
          <PastReservations />
        </Route>

        <Route path="/modifyreservation" exact>
          <ModifyReservation res={reservation} />
        </Route>

        <Route path="/dashboard" exact >
          <Test />
        </Route>

        <Route path='/products' exact >
          <Products />
          {/* <Products /> */}
        </Route>
      </Switch>

      {<Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini" locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80" copyright="nolonoloplus" />}

    </div>
  );
}


export default App;