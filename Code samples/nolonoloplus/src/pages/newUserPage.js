import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import './style/newUserPage.css';
import Spinner from '../components/Spinner'
import Reservations from "../components/Reservations";

export default function newUserPage({ nameToParent }) {
    const history = useHistory();
    const [user, setUser] = useState('');
    const [communications, setCommunications] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isReservations, setIsReservations] = useState(false);
    const [image, setImage] = useState('');
    const [isPaymentMethod, setIsPaymentMethod] = useState(false);
    const [valToChange, setValToChange] = useState('name');
    const [wait, setWait] = useState(0);

    useEffect(() => {

        async function getEmail() {
            let token = JSON.parse(sessionStorage.getItem("token"));
            const options = {
                method: 'GET'
            };
            fetch(`http://site202145.tw.cs.unibo.it/api/auth/${token}`, options)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                }).then(data => {
                    getUser(data.email);
                })
                .catch(data => { console.log('abbiamo un errore', data.message); setError(data.message); });
        };

        function getUser(email) {
            const options = {
                method: 'GET'
            };
            fetch(`http://site202145.tw.cs.unibo.it/api/user/${email}`, options)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                }).then((data) => {
                    setUser(data.user);
                    console.log("user image", data.user.image);
                    setImage(data.user.image);
                    setCommunications(data.user.communications);
                    setLoading(false);
                    document.getElementById('toFocus').scrollIntoView({ behavior: "smooth" })
                })
                .catch((err) => { console.log(err); setError(err.message); });
        };

        getEmail();
    }, [])

    useEffect(() => {
        if (wait !== 0) {
            //not at the beginning
            setIsPaymentMethod(false);
            changeForm();
        }
    }, [wait])

    function clearCommunications() {
        let newArray = [];
        const body = `{
            "communications": "${newArray}"
        }`;
        const options = {
            method: 'PATCH',
            headers: new Headers({ 'Content-type': 'application/json' }),
            body: body
        };
        fetch(`http://site202145.tw.cs.unibo.it/api/user/${user.email}`, options)
            .then(response => {
                setCommunications([]);
            })
            .catch(err => {
                console.log(err.message);
            })
    };

    function handleImageUpload() {
        let photo = document.getElementById("file-upload").files[0];
        if (photo != null) {
            let formData = new FormData();
            formData.append("img", photo);
            let picName;
            console.log(user.email)
            for (var x of formData.entries()) {
                picName = x[1].name;
            }

            fetch(`http://site202145.tw.cs.unibo.it/api/user/${user.email}`, { method: "PATCH", body: formData })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data);
                    console.log(picName);

                    setImage(`${picName}`);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    function changeForm() {
        if (!isPaymentMethod) {
            let field = document.getElementById('changeInfo').value;
            setValToChange(field);
            let newValue = document.getElementById('newValue');
            switch (field) {
                case 'phone':
                    newValue.type = 'tel';
                    newValue.pattern = "[0-9]{10}";
                    newValue.title = "not valid phone number";
                    break;
                case 'email':
                    newValue.type = 'email';
                    newValue.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$";
                    newValue.title = "not valid email format";
                    break;
                case 'paymentMethod':
                    setValToChange('payment method');
                    setIsPaymentMethod(true);
                    break;
                case 'password':
                    newValue.type = 'password';
                    newValue.pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";
                    newValue.title = "Password must contain a number, a capital letter and a length of at least 8 characters";
                    break;
                default:
                    newValue.type = 'text';
                    newValue.pattern = "[A-Za-z\\s]{1,}";
                    newValue.title = 'empty input not valid'
                    break;

            }
        } else {
            setWait(wait + 1);
        }
    }

    function showPassw() {
        let field = document.getElementById('changeInfo').value;
        let newValue = document.getElementById('newValue');
        if (field === 'password') {
            if (newValue.type === 'password')
                newValue.type = 'text';
            else {
                newValue.type = 'password';
            }
        }

    }

    function changeInfo() {
        let field = document.getElementById('changeInfo').value;
        let newValue = document.getElementById('newValue').value;
        let obj = `{
        "${field}": "${newValue}"
        }`;
        const options = {
            method: 'PATCH',
            headers: new Headers({ 'Content-type': 'application/json' }),
            body: obj
        };
        fetch(`http://site202145.tw.cs.unibo.it/api/user/${user.email}`, options)
            .then(response => {
                return response.json();
            }).then(data => {
                if (field === 'email') {
                    sessionStorage.clear();
                    history.push('/login');
                }
                else if (field === 'name') {
                    sessionStorage.setItem('username', JSON.stringify(newValue));
                    history.go(0);
                }
                else {
                    history.go(0);
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    function deleteAccount() {
        const options = {
            method: 'DELETE'
        };

        fetch(`http://site202145.tw.cs.unibo.it/api/user/${user.email}`, options)
            .then(async response => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    let data = await response.json();
                    throw new Error(data.message);
                }
            }).then(data => {
                sessionStorage.clear();
                history.push('/login');
            })
            .catch(err => {
                document.getElementById('deleteError').innerHTML = "Deletion impossible, there are still actives or future reservations";
            })
    }

    return (
        <div id="wrapper" >
            {isReservations ? <div>
                <button className="btn btn-warning m-3" onClick={() => { setIsReservations(false) }}>Back</button>
                <div id="reservations">
                    <Reservations user={user} />
                </div>
            </div>

                :
                (error ? <span> {error}</span> :
                    (loading ? <div><Spinner /></div> :
                        <div className="row" id="toFocus">
                            <div className="col-md-3 border-right">
                                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                    {console.log("qui", image)}
                                    <img className="rounded-image" alt="profile pic" src={image ? `http://site202145.tw.cs.unibo.it/images/users/${image}` : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />

                                    <form onSubmit={(event) => { event.preventDefault(); handleImageUpload(); }}>
                                        <label htmlFor="file-upload" class="custom-file-upload">
                                            <i className="fa fa-cloud-upload"></i>
                                        </label>
                                        <input id="file-upload" type="file" name="img" />

                                        <button className="btn btn-primary" type="submit">
                                            <i className="fa fa-check-circle" aria-hidden="true"></i>
                                        </button>

                                    </form>
                                    <span className="font-weight-bold">{user.name + ' ' + user.surname}</span>
                                    <span className="text-black-50">{user.email}</span>
                                    <span className="text-black-50">{'Phone number: ' + user.phone}</span>
                                    <span className="text-black-50">{'Fidelity points: ' + user.fidelityPoints}</span>
                                    <span className="text-black-50">{'Payment method: ' + user.paymentMethod}</span>
                                    <span id="deleteError"></span>
                                    <button className="btn btn-danger  m-2" type="button" onClick={deleteAccount}>Delete account</button>
                                </div>
                            </div>
                            <div className="col-md-5 border-right">
                                <div className="p-3 py-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="text-right">Change Settings</h4>
                                    </div>
                                    <div className="input-group mb-3">
                                        <label className="input-group-text" htmlFor="changeInfo">Info</label>
                                        <select className="form-select" id="changeInfo" onChange={changeForm}>
                                            <option selected value="name">Name</option>
                                            <option value="surname">Surname</option>
                                            <option value="phone">Phone</option>
                                            <option value="paymentMethod">Payment Method</option>
                                            <option value="email">Email</option>
                                            <option value="password">Password</option>
                                        </select>
                                    </div>
                                    {isPaymentMethod
                                        ?
                                        <form className="mb-3" onSubmit={(event) => { event.preventDefault(); changeInfo(); }}>
                                            <label className="form-label" htmlFor="newValue">New {valToChange}</label>
                                            <select className="form-control" id="newValue" name="paymentMethod" >
                                                <option value="MasterCard">MasterCard</option>
                                                <option selected value="Paypal">Paypal</option>
                                                <option value="PostePay">PostePay</option>
                                                <option value="Satispay">Satispay</option>
                                                <option value="Mooney">Mooney</option>
                                                <option value="Visa">Visa</option>
                                            </select>
                                            <span id="onErr"></span>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-success " type="submit">Confirm</button>
                                            </div>
                                        </form>

                                        :
                                        <form className="mb-3" onSubmit={(event) => { event.preventDefault(); changeInfo(); }}>
                                            <label htmlFor="newValue" className="form-label">New {valToChange}</label>
                                            <input type="text" className="form-control" id="newValue" required />
                                            <input type="checkbox" onClick={showPassw} />Show Password
                                            <span id="onErr"></span>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-success " type="submit">Confirm</button>
                                                <button className="btn btn-warning " type="button" onClick={() => { document.getElementById("newValue").value = ' '; }} >clear</button>
                                            </div>
                                        </form>
                                    }
                                </div>
                                <div id="reservationsEnter">
                                    <button className="btn btn-primary " type="submit" onClick={() => { setIsReservations(true) }}>Show all reservations</button>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 py-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="text-right">Communications from agency</h4>
                                    </div>
                                    {communications.length === 0 ? <div> No communications</div> :
                                        (() => {
                                            let commDivs = []
                                            for (let x = communications.length; x >= 0; x--) {
                                                console.log("comm", communications[x])
                                                if (communications[x] != null) {
                                                    console.log(communications.length)
                                                    console.log(x);
                                                    if (x === communications.length - 1)
                                                        commDivs.push(<p><b>New</b></p>)
                                                    commDivs.push(<div>{communications[x]}</div>)
                                                    commDivs.push(<div><hr /></div>)

                                                }
                                            }
                                            return (<div>
                                                <div>{commDivs}</div>
                                                <button type="button" className="btn btn-danger" onClick={clearCommunications}>clear</button>
                                            </div>
                                            )
                                        })()
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
        </div>
    );
}
