import React, { useState } from "react";
import { useHistory } from "react-router";
import './style/Login.css';


export default function Login({ stateToParent, nameToParent }) {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChange(event) {
        switch (event.target.name) {
            case 'email':
                setEmail(event.target.value);
                break;
            default:
                setPassword(event.target.value);
                break;
        }
    };

    function handleLogin(event) {
        event.preventDefault();

        const buff = Buffer.from(password, 'utf-8');
        const encodedpass = buff.toString('base64');
        
        const obj = `{
            "email": "${email}",
            "password": "${encodedpass}"
        }`;

        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-type': 'application/json' }),
            body: obj
        };
        console.log(obj);
        fetch(`http://site202145.tw.cs.unibo.it/api/account/login/user`, options)
            .then(async response => {
                if (response.status === 200) {
                    console.log("entro qua dentro");
                    return response.json();
                }
                else {
                    console.log("entro qui");
                    let data = await response.json();
                    throw new Error(data.message);
                }
            }).then(data => {
                console.log(data);
                const username = data.name;
                const token = data.accessToken;
                sessionStorage.setItem("token", JSON.stringify(token));
                sessionStorage.setItem('username', JSON.stringify(username));
                nameToParent(username);
                history.push('/');

            })
            .catch(err => {
                document.getElementById('loginmail-error').innerHTML = err;
                console.log(err);
            })
    }


    return (
        <div id="contentLogin" ><h3>Login</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label for="loginemail" className="form-label">Email address</label>
                    <input onChange={handleChange} type="email" className="form-control" name="email" id="loginemail" aria-describedby="emailHelp"
                        required="required" placeholder="nomeutente@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                    <label id='loginmail-error' for="loginemail" style={{ fontSize: 12, color: 'red' }}></label>
                </div>
                <div className="mb-3">
                    <label for="loginpassword" className="form-label">Password</label>
                    <input onChange={handleChange} type="password" className="form-control" name="password" id="loginpassword"
                        required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" />
                </div>
                <input type="submit" className="btn btn-primary" value="Login"></input>
            </form>
            <p>Don't have an account ?<a id="newLink" onClick={() => { stateToParent(false) }}>Register</a></p>

        </div>
    )
}