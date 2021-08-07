import React from "react";

function RegisterForm()
{
    return(

        <div className="container-fluid bg-light text-dark  text-center p-5 login">
             <div className="d-flex justify-content-center align-items-center">
      
            <div className="diocane">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">Name</label>
              <div id="error"></div>
              <input  className="form-control" id="name" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">Surname</label>
              <input  className="form-control" id="surname"/>
            </div>
            <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">Age</label>
                <input  className="form-control" id="age"/>
              </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
              <label className="form-check-label" for="exampleCheck1">I read and agree with <a id="privacy" href="#"> privacy terms</a> </label>
            </div>
            <button  id="button" className="btn btn-primary">Register</button>
        </div>
    </div>
    
  </div>
    );
}

export default RegisterForm;