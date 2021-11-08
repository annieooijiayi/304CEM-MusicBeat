import React,{ useEffect, useState } from 'react';
import { Link,useHistory } from 'react-router-dom';

import Axios from 'axios';

function Login(){
    let history = useHistory();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState('');

    Axios.defaults.withCredentials = true;

    const login =() => {
        Axios.post('http://localhost:5000/login', {
            user_email: userEmail,
            user_password: userPassword,
        }).then((response) => {
            console.log(response);
            if (!response.data.auth){
                setLoginStatus(response.data.message);
                history.push('/');
            }else{
                //setLoginStatus('');
                sessionStorage.setItem("token", response.data.token);
                alert('Welcome!');
                history.push('/home');
            }
        });
    };
    
    useEffect(() => {
        Axios.get('http://localhost:5000/login').then((response) => {
            
            console.log(response); 
        });
    }, []);


    return(
        <div>
            <section className="login-container">     
                <div className="login">
                    <div className="col-md-12">
                        <h5 className="main-heading">Login</h5>
                        <hr />
                        <div className="form-group">
                            <label className="mb-1">Email</label>
                            <input type="text" className="form-control" placeholder="Enter Email"  onChange ={(e) => {setUserEmail(e.target.value);}} ></input>
                        </div>
                        <div className="form-group">
                            <label className="mb-1">Password</label>
                            <input type="password" className="form-control" placeholder="Enter Password"  onChange ={(e) => {setUserPassword(e.target.value);}} ></input>
                        </div>
                        
                        <div className="form-group py-3">
                            <button type="button" className="btn btn-dark shadow w-100" onClick={login}>Login</button> 
                        </div>
                        <div className="quick-link text-center">
                            <Link to="/signup">Does not have an account? Sign Up</Link>
                        </div>
                        
                        <div className="alert" role="alert" style={{color:"red"}}>
                            {loginStatus}
                        </div>   
                        
                    </div>
                </div>
            </section>
            
        </div>
        
    );
}
export default Login;