import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials,setCredentials]= useState({name:"", email:"", password:"",cpassword:""});
    let hist=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const {name,email,password}=credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
             },
             body: JSON.stringify({name,email,password})
          });
          const json=await response.json()
          console.log(json);
          if(json.success){
            //Save the AUth Token and Redirect
            localStorage.setItem('token',json.authtoken);
            hist("/");
            props.showAlert("Account created Successful ","success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }

    }
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };
  return (
    <div className='container mt-3'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name='name' onChange={handleChange}/>
  </div>
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' onChange={handleChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name='password' onChange={handleChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={handleChange}/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
