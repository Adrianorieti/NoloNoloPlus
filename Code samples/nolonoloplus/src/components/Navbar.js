import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { useEffect } from 'react';
=======
import { useEffect, useState } from 'react';
import { useHistory } from "react-router";
>>>>>>> Adrian



function Navbar (props, { queryToParent }){

  console.log("render");

  let history = useHistory();

  const [loggato, setloggato] = useState(false);
  

  function checkLog(token)
  {
       console.log("dentro prova");
       fetch('http://localhost:8001/api/authLog',{
          headers: {
            "Authorization": `Bearer ${token}`
          }
       }).then(response =>{
         if(response.status == 200)
         {
           console.log("sei loggato");
             setloggato(true);
         }else{
           console.log("Errore, login non effettuato correttamente");
         }
       }).catch(err =>{console.log(err)});

  }

  useEffect(() =>
  {
    console.log("Use Effect");
    const token = JSON.parse(sessionStorage.getItem("token"));
    if(token)
    {
      checkLog(token);
    }
   
    if(loggato)
    {
      const logout =  document.getElementById("logout");
      logout.style.display = "block";
    
    }else{
      const logout =  document.getElementById("logout");
      logout.style.display = "none";
     }
  });



  useEffect(() => {
    if (props.display === false)
      document.getElementById("logout").style = 'display: none;';

  }, []);

  function checkAriaBurger() {
    //cambiamo  l'aria attribute  ogni volta che viene cliccato il burger
    const burger = document.getElementById("burger");
    const burgerattr = burger.getAttribute("aria-expanded");
    const newburgerattr = (burgerattr === 'false') ? 'true' : 'false';
    burger.setAttribute("aria-expanded", newburgerattr);
  }

<<<<<<< HEAD

  return (
    <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end" aria-label="primary navigation">
=======
  
    function logout()
    {
      const logout =  document.getElementById("logout");
      logout.style.display = "none";
      setloggato(false);
      sessionStorage.clear();
      history.push('/');     

    }

    function queryParent()
    {
      queryToParent(null);
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end" >
>>>>>>> Adrian
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
              <Link className="nav-link" to={'/products'} onclick={queryParent}>Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="navLoginReg" to={loggato ? '/dashboard' : '/login'}>{loggato ? props.name : "Login/Register"}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#footer" >Contacts</Link>
<<<<<<< HEAD
            </li>
            <li className="nav-item" id="logout" >
              <Link className="nav-link" >Logout</Link>
            </li>
            {/* Aggiungere Link per logout che fa richiesta get logout al server per eliminare la sessione
             e riceve isLogged=false dal server che fa
             const username = (JSON.parse(xhr.responseText)).name;
            const isLogged = (JSON.parse(xhr.responseText)).isLogged;
            childToParent(username, isLogged);
            history.push('/') */}
=======
            </li>

            <li className="nav-item" id="logout"  >
              <Link className="nav-link"  onClick={logout}>Logout</Link>
            </li> 
          
>>>>>>> Adrian
          </ul>
        </div>
      </div>
    </nav>
  );
          }



export default Navbar;