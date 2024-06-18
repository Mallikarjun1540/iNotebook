import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials,setCredentials]= useState({email:"", password:""});
    let hist=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
             },
             body: JSON.stringify({email:credentials.email, password:credentials.password})
          });
          const json=await response.json()
          console.log(json);
          if(json.success){
            //Save the AUth Token and Redirect
            localStorage.setItem('token',json.authtoken);
            props.showAlert("Login Successful ","success")
            hist("/");
          }
          else{
            props.showAlert("Invalid credentials ","danger")
          }

    }
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };
  return (
    <div className='mt-4'>
      <h2>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" value={credentials.email} onChange={handleChange} className="form-control" id="email" name='email' aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" value={credentials.password} onChange={handleChange} className="form-control" id="password" name='password'/>
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Login
