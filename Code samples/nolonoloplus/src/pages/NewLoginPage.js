import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router";
import './style/newloginpage.css';
import Login from '../components/Login';
import Register from '../components/Register';


function NewLoginPage({ nameToParent }) {
  const loginRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);

  const setStateToParent = (bool) => {
    setIsLogin(bool);
  }

  // useEffect(() => {
  //   console.log(loginRef.current)
  //   loginRef.current.focus();
  // },[])
  return (
    <div id="mainLogin" className='bg-image'>
      <div id="LogRegContainer" ref={loginRef}>
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