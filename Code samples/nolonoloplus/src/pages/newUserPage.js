import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import './style/newUserPage.css';
import Spinner from '../components/Spinner'

export default function newUserPage() {

    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
                    return (data.email);
                })
                .catch(data => { console.log('abbiamo un errore', data.message); setError(data.message); });
        };
        async function getUser() {
            let email = await getEmail();
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
                    setLoading(false);
                })
                .catch((err) => { console.log(err); setError(err.message); });
        };
        getUser();
    }, [])

    return (
        <div id="wrapper" >
            {error ? <span> {error}</span> :
                (loading ? <div><Spinner /></div> :
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" />
                                <span className="font-weight-bold">{user.name + ' ' + user.surname}</span><span className="text-black-50">{user.email}</span><span> </span>
                            </div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Profile Settings</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6"><label className="labels">Name</label><input type="text" className="form-control" placeholder="first name" value="" /></div>
                                    <div className="col-md-6"><label className="labels">Surname</label><input type="text" className="form-control" value="" placeholder="surname" /></div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12"><label className="labels">Mobile Number</label><input type="text" className="form-control" placeholder="enter phone number" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Address Line 1</label><input type="text" className="form-control" placeholder="enter address line 1" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Address Line 2</label><input type="text" className="form-control" placeholder="enter address line 2" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Postcode</label><input type="text" className="form-control" placeholder="enter address line 2" value="" /></div>
                                    <div className="col-md-12"><label className="labels">State</label><input type="text" className="form-control" placeholder="enter address line 2" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Area</label><input type="text" className="form-control" placeholder="enter address line 2" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Email ID</label><input type="text" className="form-control" placeholder="enter email id" value="" /></div>
                                    <div className="col-md-12"><label className="labels">Education</label><input type="text" className="form-control" placeholder="education" value="" /></div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6"><label className="labels">Country</label><input type="text" className="form-control" placeholder="country" value="" /></div>
                                    <div className="col-md-6"><label className="labels">State/Region</label><input type="text" className="form-control" value="" placeholder="state" /></div>
                                </div>
                                <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button">Save Profile</button></div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center experience"><span>Edit Experience</span><span className="border px-3 p-1 add-experience"><i className="fa fa-plus"></i>&nbsp;Experience</span></div><br />
                                <div className="col-md-12"><label className="labels">Experience in Designing</label><input type="text" className="form-control" placeholder="experience" value="" /></div> <br />
                                <div className="col-md-12"><label className="labels">Additional Details</label><input type="text" className="form-control" placeholder="additional details" value="" /></div>
                            </div>
                        </div>
                    </div>)}
        </div>
    );
}
