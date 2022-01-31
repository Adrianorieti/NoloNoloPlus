import React, { useState } from "react";
import { useHistory } from "react-router";
import './style/Register.css';

export default function Register({ stateToParent }) {

    let history = useHistory();
    const [firstName, setfirstName] = useState('');
    const [secondName, setsecondName] = useState('');
    const [phone, setphone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Paypal');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [repeatPassword, setrepeatPassword] = useState('');
    const [repeatpassError, setrepeatpassError] = useState('');

    function handleChange(event) {

        switch (event.target.name) {
            case 'firstName':
                setfirstName(event.target.value);
                break;
            case 'secondName':
                setsecondName(event.target.value);
                break;
            case 'phone':
                setphone(event.target.value);
                break;
            case 'paymentMethod':
                setPaymentMethod(event.target.value);
                break;
            case 'email':
                setemail(event.target.value);
                break;
            case 'password':
                setpassword(event.target.value);
                break;
            case 'repeatPassword':
                setrepeatPassword(event.target.value);
                break;
            default:
                setrepeatpassError(event.target.value);
                break;
        }
    };

    function handleRegister(event) {
        event.preventDefault();
        console.log(paymentMethod);

        const buff = Buffer.from(password, 'utf-8');
        const encodedpass = buff.toString('base64');

        if (repeatPassword !== password) {
            setrepeatpassError(" Passwords don't matches");
        }
        else {
            const obj = `{
            "name": "${firstName}" ,
            "surname": "${secondName}",
            "phone": "${phone}",
            "paymentMethod" : "${paymentMethod}",
            "email": "${email}",
            "password": "${encodedpass}"
            }`;
            const options = {
                method: 'POST',
                headers: new Headers({ 'Content-type': 'application/json' }),
                body: obj
            };
            fetch(`http://localhost:8001/api/user/${email}`, options)
                .then(async response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    else {
                        let data = await response.json();
                        throw new Error(data.message);
                    }
                }).then(data => {
                    console.log(data.message);
                    history.go(0);
                })
                .catch(err => {
                    document.getElementById('registermail-error').innerHTML = err;
                    console.log(err);
                })
        }
    }

    return (
        <div id="contentRegister">
            <h3><i className="fa fa-arrow-left" role="button" aria-label="Click to go back to login page" tabIndex={0} id="arrow" onClick={() => { stateToParent(true); }}></i> Register</h3>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label for="firstName" className="form-label">First Name</label>
                    <input onChange={handleChange} id="firstName" type="text" className="form-control" name="firstName"
                        aria-describedby="emailHelp" placeholder="John" required="required" />
                </div>

                <div className="mb-3">
                    <label for="secondName" className="form-label">Second name</label>
                    <input onChange={handleChange} id="secondName" type="text" className="form-control" name="secondName"
                        aria-describedby="emailHelp" placeholder="Doe" required="required" />
                </div>

                <div className="mb-3">
                    <label for="email" className="form-label">Email</label>
                    <input onChange={handleChange} id="email" type="email" className="form-control" name="email"
                        placeholder="username@studio.unibo.it" required="required" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="not valid email" />
                    <label id='registermail-error' for="email" style={{ fontSize: "1em", color: 'red' }}></label>

                </div>

                <div className="mb-3">
                    <label for="phone" className="form-label">Phone Number</label>
                    <input onChange={handleChange} id="phone" type="tel" className="form-control" name="phone" required="required"
                        pattern="[0-9]{10}" title="not a valid phone number" />
                </div>

                <div className="mb-3">
                    <label className="form-label" for="paymentMethod">Payment Method</label>
                    <select className="form-control" id="paymentMethod" name="paymentMethod" onChange={handleChange} >
                        <option value="MasterCard">MasterCard</option>
                        <option selected value="Paypal">Paypal</option>
                        <option value="PostePay">PostePay</option>
                        <option value="Satispay">Satispay</option>
                        <option value="Mooney">Mooney</option>
                        <option value="Visa">Visa</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input onChange={handleChange} id="password" type="password" className="form-control" name="password" required="required"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                </div>

                <div className="mb-3">
                    <label for="repeatPassword" className="form-label">Repeat Password</label>
                    <input onChange={handleChange} id="repeatPassword" type="password" className="form-control" name="repeatPassword"
                        required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                    <label for="repeatPassword" style={{ fontSize: 12, color: 'red' }}>{repeatpassError}</label>
                </div>

                <input type="submit" className="btn btn-primary" value="Register" ></input>
            </form>
        </div>
    )

}
