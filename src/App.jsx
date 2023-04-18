import React, { useEffect, useReducer } from 'react'
import { authReducer } from './modules/auth/authReducer'
import { AuthContext } from './modules/auth/authContext';
import { AppRouter } from './shared/components/AppRouter';
import AnimatedBackground from './shared/components/fondo_animado/AnimatedBackground';

import "primereact/resources/themes/lara-light-indigo/theme.css";

import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const init = () => {
  return JSON.parse(localStorage.getItem("user")) || { isLogged: false };
};

const App = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init);
  useEffect(() => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    let root = document.body.style;
    const primary = localStorage.getItem("primary");
    const secondary = localStorage.getItem("secondary");
    if (primary) root.setProperty("--bs-primary", primary);
    if (secondary) root.setProperty("--bs-secondary", secondary);
  }, [user]);


  return (

    <AuthContext.Provider value={{ dispatch, user }}>
      <AnimatedBackground />
      <AppRouter />
    </AuthContext.Provider>
    //<LoginScreen/>
    //<Redirection/>
    //<PersonalRedirect/>
  )
}

export default App;
