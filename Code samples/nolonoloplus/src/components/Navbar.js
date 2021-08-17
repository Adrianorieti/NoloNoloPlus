import React from 'react';
import { Link } from 'react-router-dom';

function Navbar(props) {

  function checkAriaBurger()
  {
    //cambiamo  l'aria attribute  ogni volta che viene cliccato il burger
    const burger = document.getElementById("burger");
    const burgerattr = burger.getAttribute("aria-expanded");
    const newburgerattr = (burgerattr  === 'false') ? 'true' : 'false';
    burger.setAttribute("aria-expanded",newburgerattr);
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">{props.logoName}</a>
        <button id="burger" onclick={checkAriaBurger} className="navbar-toggler custom-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon "></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
          <ul className="navbar-nav ">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="navLoginReg" to="/login">{props.name}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacts" tabIndex="-1" >Contacts</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;