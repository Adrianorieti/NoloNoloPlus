import React from 'react';
import  {Link} from 'react-router-dom';

function Navbar(props)
{

    return(
        <nav className="navbar navbar-expand-lg navbar-success bg-success justify-content-end">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">{props.logoName}</a>
          <button className="navbar-toggler custom-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                <Link className="nav-link" to="/login">Login/Register</Link>
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