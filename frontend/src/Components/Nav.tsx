import React from 'react';
import * as S from './styles';

import Login from './Login';
import AssignTasks from './AssignTasks';
import About from './About';
import Contacts from './contacts';
import Home from './Home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from 'react-router-dom';

type Prop = {
  open: boolean;
};

// NavLink is used to add styling attributes to the rendered element when it matches the current URL.
function Nav(props: Prop) {
  return (
    <Router>
      <S.navbar open={props.open}>
        
        
        <NavLink
          to='/Home'
          activeStyle={{
            fontWeight: 'bold',
            color: '#00b300',
          }}
        >
          <S.text>Home</S.text>
        </NavLink>
        
       
        <NavLink
          to='/Assign tasks'
          activeStyle={{
            fontWeight: 'bold',
            color: '#00b300',
          }}
        >
          <S.text>Assign tasks</S.text>
        </NavLink>

        <NavLink
          to='/About'
          activeStyle={{
            fontWeight: 'bold',
            color: '#00b300',
          }}
        >
          <S.text>About</S.text>
        </NavLink>

        <NavLink
          to='/Contact'
          activeStyle={{
            fontWeight: 'bold',
            color: '#00b300',
          }}
        >
          <S.text>Contact</S.text>
        </NavLink>

        <NavLink
          to='/Logout'
          activeStyle={{
            fontWeight: 'bold',
            color: '#00b300',
          }}
        >
          <S.text>Logout</S.text>
        </NavLink>
      </S.navbar>

      <Switch>

        <Route exact path='/Home'><Home /></Route>

        <Route exact path='/Assign tasks'><AssignTasks /></Route>

        <Route exact path='/About'><About /></Route>

        <Route exact path='/Contact'><Contacts /></Route>

        <Route exact path='/Logout'><Login /></Route>
          
      
        <Redirect to='/Home' />
      </Switch>

    
    </Router>
  );
}

export default Nav;