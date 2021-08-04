import React from "react";

function LoginPage()
{
    return(
    <div className="login" scrolling="auto">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Login</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Register</button>
        </li>
       
      </ul>

      <div className="tab-content" id="myTabContent">

        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" />
              <label className="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
    
    
        </div>
    
        <div className="tab-pane fade register" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    
          <div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">User name</label>
              <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="John Doe" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Email</label>
              <input type="email" className="form-control" id="exampleInputPassword1" placeholder="diocane@studio.unibo.it" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Phone Number</label>
              <input type="text" className="form-control" id="exampleInputPassword1" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Repeat Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" />
              <label className="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
    
    
        </div>
      </div>

      </div>
      
    );
}

export default LoginPage;