import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

function LogIn({setAuth}) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  //set credentials on input
  const setInput = e => setCredentials({...credentials, [e.target.name]: e.target.value});

  //form submitted
  const submitForm = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
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
        toast.success("Logged in Successfully!");
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
  
  return (
    <div className = "logInContainer">
      <h1>Log In</h1>
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
        <label htmlFor="passwordInput">Enter password: </label>
        <input
          type="password"
          id="passwordInput"
          name="password"
          value={credentials.password}
          onChange={(event) => setInput(event)}
          placeholder="..."
        />
        <button>Log In</button>
        <p>No Account? </p>
        <Link to = "/register">Register Here</Link>
      </form>
    </div>
  )
}

export default LogIn