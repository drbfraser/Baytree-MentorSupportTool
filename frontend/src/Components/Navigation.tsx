import React from 'react';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import pink from '@mui/material/colors/pink';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Home from './Home';
import Goals from './Goals';
import Logo from '../Assets/baytree-logo.png';
import SideLogo from '../Assets/changing-aspirations.png';
import Logout from './Logout';
import Messages from './Messages';
import Notifications from './Notifications';
import Profile from './Profile';
import Questionnaire from './Questionnaire';
import Records from './Records';
import Reporting from './Reporting';
import Resources from './Resources';
import CreateGoals from './CreateGoals';

const drawerWidth = 240;

export default function Navigation() {

  let match = useRouteMatch();

  return (
    <div className="content" style={{ background: '#faf6ed'}}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" style={{ background: 'white' }} sx={{ zIndex: (theme) => theme.zIndex.drawer + 5 }}>
          <Toolbar>
              <Grid container spacing={5}>
                  <Grid item xs = {9}>
                      <Box   
                      display = "flex"
                      alignItems = "left"
                      justifyContent = "left"
                      margin = "6px">
                          <img src = {Logo} alt = "Logo" width = "null" height = "80" />
                          <img src = {SideLogo} alt = "Logo" width = "null" height = "80" />
                      </Box>
                  </Grid>
                  <Grid item style = {{marginTop: "20px"}}>
                      <Link to = {`${match.url}/messages`} style={{ textDecoration: 'none', color: 'black' }}> 
                          <IconButton size="large" color="inherit">
                              <Badge badgeContent={4} color="error">
                                  <MailIcon />
                              </Badge>
                          </IconButton>
                      </Link>
                      <Link to = {`${match.url}/notifications`} style={{ textDecoration: 'none', color: 'black' }}>
                          <IconButton size="large" color="inherit">
                              <Badge badgeContent={17} color="error">
                                  <NotificationsIcon />
                              </Badge>
                          </IconButton>
                      </Link>
                      <Link to = {`${match.url}/profile`} style={{ textDecoration: 'none', color: 'black' }}>
                          <IconButton color = "inherit" size = "large">
                              <AccountBoxIcon />
                          </IconButton>
                      </Link>
                      <IconButton onClick = {Logout} style = {{color: "black"}} size = "large">
                          <LogoutIcon />
                      </IconButton>
                  </Grid>
              </Grid>
          </Toolbar>  
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Grid item style = {{marginTop: "30px"}}>
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {['Home', 'Reporting', 'Resources', 'Questionnaire','newGoal', 'Goals', 'Records'].map((text, index) => (
              <Link to = {`${match.url}/${text}`} style={{ textDecoration: 'none', color: 'black' }} key = {text}>
                <ListItem button>
                  <ListItemIcon>
                          {(() => {
                          switch(text) {
                            case "Home": return <HomeIcon sx={{ color: pink[500]}}/>;
                            case "Reporting": return <CreateIcon sx={{ color: pink[500]}}/>;
                            case "Resources": return <LibraryBooksIcon sx={{ color: pink[500]}}/>;
                            case "Questionnaire": return <QuestionAnswerIcon sx={{ color: pink[500]}}/>;  
                            case "newGoal": return <AssignmentIcon sx={{ color: pink[500]}}/>;
                            case "Goals": return <AutoGraphIcon sx={{ color: pink[500]}}/>;
                            case "Records": return <BookIcon sx={{ color: pink[500]}}/>;         
                            }
                          })()}
                  </ListItemIcon>
                  <ListItemText>
                          {(() => {
                          switch(text) {
                              case "Reporting": return 'Create Session';
                              case "Questionnaire": return 'Progress Report'; 
                              case "newGoal": return 'Create a new Goal';    
                              default: return (text);
                            }
                          })()}
                  </ListItemText>
                </ListItem>
              </Link>
              ))}
            </List>
          </Box>
          </Grid>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Switch>
              <Route path={`${match.path}/home`}>
                  <Home />
              </Route>
              <Route path={`${match.path}/resources`}>
                  <Resources />
              </Route>
              <Route path={`${match.path}/reporting`}>
                  <Reporting />
              </Route>
              <Route path={`${match.path}/questionnaire`}>
                  <Questionnaire />
              </Route>
              <Route path={`${match.path}/profile`}>
                  <Profile />
              </Route>
              <Route path={`${match.path}/newGoal`}>
                <CreateGoals />
              </Route>
              <Route path={`${match.path}/goals`}>
                  <Goals />
              </Route>
              <Route path={`${match.path}/records`}>
                  <Records />
              </Route>
              <Route path={`${match.path}/messages`}>
                  <Messages />
              </Route>
              <Route path={`${match.path}/notifications`}>
                  <Notifications />
              </Route>
          </Switch>
        </Box>
      </Box>
    </div>
  );
}