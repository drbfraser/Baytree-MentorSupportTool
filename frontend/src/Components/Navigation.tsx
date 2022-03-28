import React, { useEffect } from "react";
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
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import pink from '@mui/material/colors/pink';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreateIcon from '@mui/icons-material/Create';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

import { API_BASE_URL } from "../api/url";

import Home from './Home';
import Goals from './Goals';
import Logo from '../Assets/baytree-logo.png';
import SideLogo from '../Assets/changing-aspirations.png';
import Logout from './Logout';
import Messages from './Messages';
import Profile from './Profile';
import Questionnaire from './Questionnaire';
import Sessions from './Sessions';
import Records from './Records';
import Notification from './Notification';
const drawerWidth = 240;

export default function Navigation() {
  let match = useRouteMatch();
  
  const [numNotifications, setNumNotifications] = React.useState(0);
  const [resourcesURL, setResourcesURL] = React.useState("");
  
  const fetchNumNotifications = () => {
    fetch(`${API_BASE_URL}/notifications/get_unread_count/?mentor_id=${localStorage.getItem('user_id')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setNumNotifications(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const fetchResourcePage = () =>{
    fetch(`${API_BASE_URL}/resources/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
          },
          credentials: "include"
    })
    .then(response => response.json())
    .then((data) => {
      setResourcesURL(JSON.parse(data)[0].Resource);
    });
  }
  useEffect(() => {
    fetchResourcePage();
    fetchNumNotifications();
  }, []);

  return (
    <div className="content" style={{ background: '#f9f9f9', minHeight:'100vh'}}>
      <Box sx={{ display: 'flex', width:'100%', height: 'auto', margin: 'auto' }}>
        <CssBaseline />
        <AppBar position="fixed" style={{ background: 'white', width:'100%', height: 'auto', margin: 'auto' }} sx={{ zIndex: (theme) => theme.zIndex.drawer + 5 }}>
          <Toolbar style={{ }}>
              <Grid container spacing={'auto'}>
                  <Grid item xs = {9}>
                      <Box   
                      display = "flex"
                      alignItems = "left"
                      justifyContent = "left"
                      margin = "6px"
                      color = "green">
                          <img src = {Logo} alt = "Logo" width = "null" height = "80" />
                          <img src = {SideLogo} alt = "Logo" width = "null" height = "80" />
                          <h3>Mentor Portal</h3>
                      </Box>
                  </Grid>
                  <Grid item style = {{marginTop: "20px"}}>
                      <Grid container spacing = {2}> 
                        <Grid item xs = {3}>
                        <Messages />
                        </Grid>
                        <Grid item xs = {3}>  
                          <Link to = {`${match.url}/notifications`} style={{ textDecoration: 'none', color: 'black' }}>
                              <IconButton color = "inherit" size = "large">
                                <Badge badgeContent={numNotifications} color="error">
                                    <NotificationsIcon />
                                </Badge>
                              </IconButton>
                          </Link>
                        </Grid>
                        <Grid item xs = {3}>
                        <Link to = {`${match.url}/profile`} style={{ textDecoration: 'none', color: 'black' }}>
                            <IconButton color = "inherit" size = "large">
                                <AccountBoxIcon />
                            </IconButton>
                        </Link>
                        </Grid>
                        <Grid item xs = {3}>
                        <IconButton onClick = {Logout} style = {{color: "red"}} size = "large">
                            <LogoutIcon />
                        </IconButton>
                        </Grid>
                      </Grid>
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

              {['Home', 'Sessions', 'Questionnaires','Goals', 'Records', 'Notifications'].map((text, index) => (

              <Link to = {`${match.url}/${text}`} style={{ textDecoration: 'none', color: 'black' }} key = {text}>
                <ListItem button>
                  <ListItemIcon>
                          {(() => {
                          switch(text) {
                            case "Home": return <HomeIcon sx={{ color: pink[500]}}/>;
                            case "Sessions": return <CreateIcon sx={{ color: pink[500]}}/>;
                            case "Questionnaires": return <QuestionAnswerIcon sx={{ color: pink[500]}}/>;  
                            case "Goals": return <AutoGraphIcon sx={{ color: pink[500]}}/>;
                            case "Records": return <BookIcon sx={{ color: pink[500]}}/>;         
                            case "Notifications": return <NotificationsIcon sx={{ color: pink[500]}}/>;         
                            }
                          })()}
                  </ListItemIcon>
                  <ListItemText>
                          {(() => {
                          switch(text) {
 
                              case "Sessions": return 'Create Session'
                              default: return (text);
                            }
                          })()}
                  </ListItemText>
                </ListItem>
              </Link>
              ))}
              <ListItem button component="a" href={resourcesURL} target="_blank">
                <ListItemIcon>
                  <LibraryBooksIcon sx={{ color: pink[500]}}/>
                </ListItemIcon>
                <ListItemText>
                  Resources
                </ListItemText>
              </ListItem>
              <ListItem button component="a" href= "mailto: federica@baytreecentre.org.uk" target="_blank">
                <ListItemIcon>
                  <PermDeviceInformationIcon sx={{ color: pink[500]}}/>
                </ListItemIcon>
                <ListItemText>
                  Help
                </ListItemText>
              </ListItem>
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
              <Route path={`${match.path}/sessions`}>
                  <Sessions />
              </Route>
              <Route path={`${match.path}/questionnaires`}>
                  <Questionnaire />
              </Route>
              <Route path={`${match.path}/profile`}>
                  <Profile />
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
                  <Notification />
              </Route>
          </Switch>
        </Box>
      </Box>
    </div>
  );
}