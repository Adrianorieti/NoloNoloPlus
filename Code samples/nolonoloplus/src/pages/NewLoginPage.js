import React, { useState } from "react";
import { useHistory } from "react-router";
import './style/newloginpage.css';
import Login from '../components/Login';
import Register from '../components/Register';


function NewLoginPage({ nameToParent }) {
  const [isLogin, setIsLogin] = useState(true);

  const setStateToParent = (bool) => {
    setIsLogin(bool);
  }

  return (
    <div id="mainLogin" className='bg-image'>
      <div id="LogRegContainer">
        {isLogin ?

          <Login stateToParent={setStateToParent} nameToParent={nameToParent} />
          :
          <Register stateToParent={setStateToParent} />
        }
      </div>
    </div>
  )
}

export default NewLoginPage;