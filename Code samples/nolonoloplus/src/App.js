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
import Hypothesis from './pages/Hypothesis';
import Products from './pages/Products';
import UpdatePage from './pages/UpdatePage';
import PersonalPage from './pages/PersonalPage';
import NewUserPage from './pages/newUserPage';
import FutureReservations from './pages/FutureReservations';
import ModifyReservation from './pages/ModifyReservation';
import ActiveReservations from "./pages/ActiveReservations";
import PastReservations from "./pages/PastReservations";
import About from './pages/About';
import Howitworks from './components/Howitworks'
import { Link } from 'react-router-dom';

import Rental from './pages/Rental';

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
      <Header />
      <Navbar name={data} queryToParent={queryToParent} />
      <Switch>

        <Route path="/" exact >
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li>Home</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="row">
              <div className="col-md-12 rentform">
                <Howitworks />
              </div>
            </div>
          </section>

          <section className="App-content bg-image container-properties" id="rentForm">
            <div className="row">
              <div className="col-md-6 rentform">
                <RentForm queryToParent={queryToParent} />
              </div>
              <div className="col-md-6 banner">
                <h4>We provide the mean you choose the place</h4>
              </div>
            </div>
          </section>

          {<div> <CarouselContainer /> </div>}

        </Route>

        <Route path="/login" exact >
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Login</li>
                </ul>
              </div>
            </div>
          </section>
          <LoginPage nameToParent={nameToParent} />
        </Route>

        <Route path="/personalpage" exact>

          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Personal page</li>
                </ul>
              </div>
            </div>
          </section>
          <PersonalPage />

        </Route>

        <Route path="/newpersonalpage" exact>
          <NewUserPage />

          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Update page</li>
                </ul>
              </div>
            </div>
          </section>

        </Route>

        <Route path="/futurereservations" exact>
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Future reservation</li>
                </ul>
              </div>
            </div>
          </section>
          <FutureReservations resToParent={resToParent} />
        </Route>

        <Route path="/activereservations" exact>
          <ActiveReservations />
        </Route>

        <Route path="/pastreservations" exact>
          <PastReservations />
        </Route>

        <Route path="/modifyreservation" exact>
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>My reservations</li>
                </ul>
              </div>
            </div>
          </section>
          <ModifyReservation res={reservation} />
        </Route>

        <Route path="/hypothesis" exact >
          <Hypothesis />
        </Route>
        <Route path="/rental" exact >
          <Rental />
        </Route>

        <Route path="/test" exact >
          <Test />
        </Route>


        <Route path='/products' exact >
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Products</li>
                </ul>
              </div>
            </div>
          </section>
          <Products />
          {/* <Products /> */}
        </Route>


        <Route path='/contatts' exact >
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>Contacts</li>
                </ul>
              </div>
            </div>
          </section>

        </Route>

        <Route path='/about' exact >
          {/* <Navbar name={data} queryToParent={queryToParent} /> */}
          <section>
            <div className="row">
              <div className="col-md-12">
                <ul class="breadcrumb">
                  <li><Link aria-current="page" to="/">Home</Link></li>
                  <li>About</li>
                </ul>
              </div>
            </div>
            <About />
          </section>

        </Route>
      </Switch>


      {<Footer companyName="NoloNoloPlus" locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80" copyright="nolonoloplus" />}




    </div >
  );
}


export default App;