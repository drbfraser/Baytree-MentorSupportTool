import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            <NavLink activeClassName="active" to="/login">Login</NavLink>
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
          </div>
          <div className="content">
            <Switch>
              <PublicRoute exact path = '/' component = {Home} />
              <PublicRoute exact path = "/login" component = {Login} />
              <PrivateRoute path = "/dashboard" component = {Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;