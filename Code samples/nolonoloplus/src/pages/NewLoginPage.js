import React, { useState } from "react";
import { useHistory } from "react-router";
import './style/newloginpage.css';


function NewLoginPage()
{
    const [isLogin, setIsLogin] = useState(true);
    
    return (
        <div id="mainLogin" className='bg-image'>
            <div id="loginContainer">
        {isLogin ? 
            <div id="contentLogin"><h3>Login</h3>
            <form >
              <div className="mb-3">
                <label for="loginemail" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="loginemail" aria-describedby="emailHelp"
                  required="required" placeholder="nomeutente@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                <label id='loginmail-error' for="loginemail" style={{ fontSize: 12, color: 'red' }}></label>

              </div>
              <div className="mb-3">
                <label for="loginpassword" className="form-label">Password</label>
                <input  type="password" className="form-control" name="password" id="loginpassword"
                  required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
              </div>
              <input type="submit" className="btn btn-primary" value="Login"></input>
            </form>
            <p>Don't have an account ?<a id="newLink" onClick={() => { setIsLogin(false)}}>Register</a></p>

            </div>
        :
        <div id="contentRegister"><h3>Register</h3>
        </div>}
        </div>
      </div>
    )
}

export default NewLoginPage;