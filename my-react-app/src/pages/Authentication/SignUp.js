import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

function SignUp({setAuth}) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPass: ""
  });
  //set credentials on input
  const setInput = e => setCredentials({...credentials, [e.target.name]: e.target.value});

  //form submitted
  const submitForm = async (e) =>{
    e.preventDefault();
    //first check if passwords match
    if(credentials.password != credentials.confirmPass){
      toast.error("Passwords don't match");
    }else{
      try {
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          body: JSON.stringify({username:credentials.username, password: credentials.password}),
          headers: {
            "Content-type": "application/json"
          }
        });
        const parseRes = await response.json();
        //token returned, log in successful
        if(parseRes.token){
          //store token in local storage
          localStorage.setItem("token", parseRes.token);
          //authenticated
          setAuth(true);
          toast.success("Successfully Registered!");
        }else{
          //unsuccessful
          setAuth(false);
          toast.error(parseRes);
        }
        console.log(parseRes);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  
  return (
    <div className = "signUpContainer">
      <h1>Sign Up</h1>
      <form onSubmit={submitForm}>
        <label htmlFor="usernameInput">Enter username: </label>
        <input
          type="text"
          id="usernameInput"
          name="username"
          value={credentials.username}
          onChange={(event) => setInput(event)}
          placeholder="..."
        />
        <label htmlFor="passwordInput">Enter new password: </label>
        <input
          type="password"
          id="passwordInput"
          name="password"
          value={credentials.password}
          onChange={(event) => setInput(event)}
          placeholder="..."
        />
        <label htmlFor="passwordCheckInput">Confirm password: </label>
        <input
          type="password"
          id="passwordCheckInput"
          name="confirmPass"
          value={credentials.confirmPass}
          onChange={(event) => setInput(event)}
          placeholder="..."
        />
        <button>Sign up</button>
      </form>
      <p>Already Registered?</p>
      <Link to = "/login">Log In Here</Link>
    </div>
  )
}

export default SignUp;