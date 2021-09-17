import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import {AppContext} from '../store/Context';
import { useHistory } from "react-router";



function Navbar (props){

  console.log("render");

  let history = useHistory();

  const {isLogged, setLog} = useContext(AppContext);


  const [loggato, setloggato] = useState(false);
  

  function prova(token)
  {

       console.log("dentro prova");
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:8001/api/authLog", true);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.onload = () =>
      {
        if(xhr.status == 200)
         { 
           console.log("sei loggato");
            setloggato(true);
          console.log("loggato è" + loggato);
        }
        else
          console.log("non sei loggato");
      }
      xhr.send();
    
  }

  useEffect(() =>
  {
    console.log("Use Effect");
    const token = JSON.parse(sessionStorage.getItem("token"));
    if(token)
    {
      prova(token);
    }
    const data = sessionStorage.getItem('isLogged');
   
    if(data)
    {
      const logout =  document.getElementById("logout");
      logout.style.display = "block";
    
    }else{
      const logout =  document.getElementById("logout");
      logout.style.display = "none";
     }
  });

  function checkAriaBurger()
  {
    //cambiamo  l'aria attribute  ogni volta che viene cliccato il burger
    const burger = document.getElementById("burger");
    const burgerattr = burger.getAttribute("aria-expanded");
    const newburgerattr = (burgerattr  === 'false') ? 'true' : 'false';
    burger.setAttribute("aria-expanded",newburgerattr);
  }

  
    function logout()
    {
      const logout =  document.getElementById("logout");
      logout.style.display = "none";
      setloggato(false);
      sessionStorage.setItem('isLogged', false);
      sessionStorage.clear();
      history.push('/');     

    }


  return (
    <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end" >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">NoloNoloPlus</a>
        <button id="burger" onClick={checkAriaBurger} className="navbar-toggler custom-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon "></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
          <ul className="navbar-nav ">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={loggato ? '/dashboard' : '/login'}>Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="navLoginReg" to={loggato ? '/dashboard' : '/login'}>{loggato ? props.name : "Login/Register"}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#footer" >Contacts</Link>
            </li>

            <li className="nav-item" id="logout"  >
              <Link className="nav-link"  onClick={logout}>Logout</Link>
            </li> 
          
          </ul>
        </div>
      </div>
    </nav>
  );
          }



export default Navbar;