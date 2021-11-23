import { Route, Redirect } from 'react-router-dom';
import React from 'react';

export default function PublicRoute({...routeProps}) {
    if (localStorage.getItem('token') == null) {
        return <Route {...routeProps} />;
    } 
    else {
        return <Redirect to={{ pathname: '/dashboard' }} />;
    }
};
  