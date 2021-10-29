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
import Products from './components/Products';



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
        <div className="App" >
            <Switch>
                <Route path="/" exact >
                    <Header />
                    <Navbar name={data} queryToParent={queryToParent} />

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


                    <Navbar name={data} queryToParent={queryToParent} />
                    <LoginPage nameToParent={nameToParent} />
                </Route>

                <Route path="/dashboard" exact >
                    <Test />
                </Route>

                <Route path='/products' exact >
                    <Navbar name={data} queryToParent={queryToParent} />
                    <Products />
                </Route>
            </Switch>

            {<Footer companyName="NoloNoloPlus" prod1="Biciclette" prod2="Monopattini" locality="Bologna, BO 40121, IT" mail="info@nolonolo.it" number="+39 051 268 80" copyright="nolonoloplus" />}

        </div>
    );
}


export default App;