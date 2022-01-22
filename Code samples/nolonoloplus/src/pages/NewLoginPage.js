import React, { useState, useEffect} from "react";
import './style/newloginpage.css';
import Login from '../components/Login';
import Register from '../components/Register';


function NewLoginPage({ nameToParent }) {
  

  const [isLogin, setIsLogin] = useState(true);

  const setStateToParent = (bool) => {
    setIsLogin(bool);
  }

  useEffect(() => {
    document.getElementById('LogRegContainer').scrollIntoView({behavior: "smooth"})
  },[])
  return (
    <div id="mainLogin" className='bg-image'>
      <div id="LogRegContainer" >
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