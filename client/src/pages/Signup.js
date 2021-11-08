import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Axios from 'axios';

function SignUp(){
    let history = useHistory();

    const [userNameReg, setUserNameReg] = useState('');
    const [userEmailReg, setUserEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [errorAlert, setErrorAlert] = useState('');

    Axios.defaults.withCredentials = true;

    const signup =() => {
        Axios.post('http://localhost:5000/signup', {
            user_name: userNameReg,
            user_email: userEmailReg,
            user_password: passwordReg
        }).then((response) => {
            console.log(response);
            
            if (response.data.message === 'Registered successfully!'){
                //setErrorAlert(response.data.message);
                alert('Registered successfully!');
                history.push('/');
            }else{
                setErrorAlert(response.data.message);
            }
        });
        
    };

    return(
        <div>
            <section className="signup-container">
                <div className="signup">
                    <div className="col-md-12">
                        <h5 className="main-heading">Sign Up</h5>
                        <hr />
                        <div className="form-group">
                            <label className="mb-1">Full Name</label>
                            <input type="text" className="form-control" placeholder="Enter Full Name"  onChange ={(e) => {setUserNameReg(e.target.value);}} ></input>
                        </div>
                        <div className="form-group">
                            <label className="mb-1">Email</label>
                            <input type="text" className="form-control" placeholder="Enter Email"  onChange ={(e) => {setUserEmailReg(e.target.value);}} ></input>
                        </div>
                        <div className="form-group">
                            <label className="mb-1">Password</label>
                            <input type="password" className="form-control" placeholder="Enter Password"  onChange ={(e) => {setPasswordReg(e.target.value);}} ></input>
                        </div>
                        <div className="form-group py-3">
                            <button type="button" className="btn btn-dark shadow w-100" onClick={signup}>Sign Up</button> 
                        </div>
                        <div className="quick-link text-center">
                            <Link to="/">Already Have An Account? Login</Link>
                        </div><div className="alert" role="alert" style={{color:"red"}}>
                            {errorAlert}
                        </div>
                    </div>
                </div>
            </section>
            
        </div>

        
    );
}
export default SignUp;