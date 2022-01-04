import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import './style/newUserPage.css';
import Spinner from '../components/Spinner'

export default function newUserPage() {

    const history = useHistory();

    const [user, setUser] = useState('');
    const [communications, setCommunications] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');

    useEffect(() => {
        async function getEmail() {
            let token = JSON.parse(sessionStorage.getItem("token"));
            const options = {
                method: 'GET'
            };
            fetch(`http://localhost:8001/api/auth/${token}`, options)
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
            fetch(`http://localhost:8001/api/user/${email}`, options)
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    }
                }).then((data) => {
                    console.log(data);
                    setUser(data.user);
                    setCommunications(data.user.communications);
                    setLoading(false);
                })
                .catch((err) => { console.log(err); setError(err.message); });
        };
        getEmail();
    }, [])

    function clearCommunications() {
        const body = `{
            "communications": ""
        }`;
        const options = {
            method: 'PATCH',
            headers: new Headers({ 'Content-type': 'application/json' }),
            body: body
        };
        fetch(`http://localhost:8001/api/user/${user.email}`, options)
            .then(response => {
                setCommunications([]);
            })
            .catch(err => {
                console.log(err.message);
            })
    };

    function handleImageUpload() {
        let photo = document.getElementById("file-upload").files[0];
        let formData = new FormData();

        formData.append("img", photo);

        // for(let pair of formData.entries()) {
        //     console.log(pair);
        //   }
        fetch(`http://localhost:8001/api/user/${user.email}`, { method: "POST", body: formData })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log("Ok andato tutto liscio");
                //qui facciamo setImage così renderizza di nuovo il componente e cambia l'imamgine da solo
            })
            .catch(err => {
                console.log(err);
            })
    }

    function changePattern() {
        let field = document.getElementById('changeInfo').value;
        let newValue = document.getElementById('newValue');
        switch (field) {
            case 'phone':
                newValue.type = 'tel';
                newValue.pattern = "[0-9]{10}"
                break;
            case 'email':
                newValue.type = 'email';
                newValue.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
                newValue.title = "not valid email format"
                break;
            case 'password':
                newValue.type = 'password';
                newValue.pattern = "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}";
                newValue.title = "Password must contain a number, a capital letter and a length of at least 8 characters";
                break;
            default:
                newValue.type = 'text';
                newValue.pattern = '';
                newValue.title = 'empty input not valid'
                break;

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
        fetch(`http://localhost:8001/api/user/${user.email}`, options)
            .then(response => {
                return response.json();
            }).then(data => {
                if (field === 'email') {
                    sessionStorage.clear();
                    history.push('/login');
                }
                else {
                    history.go(0);
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }


    return (
        <div id="wrapper" >
            {error ? <span> {error}</span> :
                (loading ? <div><Spinner /></div> :
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img className="rounded-circle mt-5" width="150px" src={image ? image : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />

                                <form>
                                    <label for="file-upload" class="custom-file-upload">
                                        <i class="fa fa-cloud-upload"></i>
                                    </label>
                                    <input id="file-upload" type="file" name="img" />

                                    <button className="btn btn-primary" onClick={handleImageUpload}>
                                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                                    </button>

                                </form>
                                <span className="font-weight-bold">{user.name + ' ' + user.surname}</span>
                                <span className="text-black-50">{user.email}</span>
                                <span className="text-black-50">{'phone number: ' + user.phone}</span>
                                <span className="text-black-50">{'fidelity points: ' + user.fidelityPoints}</span>
                                <span className="text-black-50">{'Payment method: ' + user.paymentMethod}</span>
                            </div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Change Settings</h4>
                                </div>
                                <div className="input-group mb-3">
                                    <label className="input-group-text" for="changeInfo">Info</label>
                                    <select className="form-select" id="changeInfo" onChange={changePattern}>
                                        <option selected value="name">Name</option>
                                        <option value="surname">Surname</option>
                                        <option value="phone">Phone</option>
                                        <option value="email">Email</option>
                                        <option value="password">Password</option>
                                    </select>
                                </div>
                                <form className="mb-3" onSubmit={(event) => { event.preventDefault(); changeInfo(); }}>
                                    <label for="newValue" className="form-label">New Value</label>
                                    <input type="text" className="form-control" id="newValue" required />
                                    <input type="checkbox" onClick={showPassw} />Show Password
                                    <span id="onErr"></span>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-success " type="submit">Confirm</button>
                                        <button className="btn btn-warning " type="button" onClick={() => { document.getElementById("newValue").value = ' '; }} >clear</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Communications from agency</h4>
                                </div>
                                {communications.length <= 1 ? <div> No communications</div> :
                                    (() => {
                                        let commDivs = []
                                        for (let com of communications) {
                                            commDivs.push(<div className="communications-wrapper">{com}</div>)
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
                    </div>)}
        </div>
    );
}
