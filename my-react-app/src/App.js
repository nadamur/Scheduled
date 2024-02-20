import React, {Fragment, useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//pages
import LogIn from './pages/Authentication/LogIn';
import SignUp from './pages/Authentication/SignUp';
import Availability from './pages/Configuration/Availability';
import Employees from './pages/Configuration/Employees';
import StoreOptions from './pages/Configuration/StoreOptions';
import Home from './pages/Home';
import Schedule from './pages/Schedule';


function App(){
  const checkAuthenticated = async () =>{
    try{
      const res = await fetch ('http://localhost:5000/auth/verify', {
        method: "POST",
        headers: {jwt_token: localStorage.token}
      });

      const parseRes = await res.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }catch(err){
      console.log(err.message);
    }
  }

  useEffect(() =>{
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean =>{
    setIsAuthenticated(boolean);
  };

  return(
    <Fragment>
      <Router>
        <div className='container'>
          <ToastContainer/>
          <Routes>
            <Route
              exact path = "/login"
              element={!isAuthenticated ? ( <LogIn setAuth={setAuth} />) : (<Navigate to="/"/>)}/>
            <Route
              exact path = "/"
              element={isAuthenticated ? ( <Home setAuth={setAuth} />) : (<Navigate to="/login"/>)}/>
            <Route
              exact path = "/register"
              element={!isAuthenticated ? ( <SignUp setAuth={setAuth} />) : (<Navigate to="/"/>)}/>
          </Routes>
        </div>
      </Router>
    </Fragment>
  )
};

export default App;