import React, {Fragment, useState, useEffect} from 'react';
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import {toast} from "react-toastify";

//pages
import LogIn from './pages/Authentication/LogIn';
import SignUp from './pages/Authentication/SignUp';
import Availability from './pages/Configuration/Availability';
import Employees from './pages/Configuration/Employees';
import StoreOptions from './pages/Configuration/StoreOptions';
import Home from './pages/Home';
import Schedule from './pages/Schedule';

//toast.configure();

function App(){
  const checkAuthenticated = async () =>{
    try{
      const res = await fetch ('http://localhost:5000/authentication/verify', {
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
          <Routes>
            <Route
              exact path = "/login"
              render={props => 
                !isAuthenticated ? ( <LogIn {...props} setAuth={setAuth} />) : (<Navigate to="/home"/>)}/>
            <Route
              exact path = "/register"
              render={props => 
                !isAuthenticated ? ( <SignUp {...props} setAuth={setAuth} />) : (<Navigate to="/home"/>)}/>
            <Route
              exact path = "/"
              render={props => 
                !isAuthenticated ? ( <Home {...props} setAuth={setAuth} />) : (<Navigate to="/login"/>)}/>
          </Routes>
        </div>
      </Router>
    </Fragment>
  )
};

export default App;