import { Switch, Route, NavLink, useRouteMatch, Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreateIcon from '@mui/icons-material/Create';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import UploadIcon from '@mui/icons-material/Upload';

import Inbox from './Inbox';
import Logo from '../Assets/baytree-logo-horizontal.png';
import Logout from './Logout';
import Profile from './Profile';
import Questionairre from './Questionairre';
import Reporting from './Reporting';
import Resources from './Resources';

const drawerWidth = 240;

export default function Navigation() {

  let match = useRouteMatch();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{ background: '#79914e' }} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Grid container spacing={12}>
                <Grid item xs={9}>
                    <Box   
                    display = "flex"
                    alignItems = "left"
                    justifyContent = "left"
                    margin = "0px">
                        <img src = {Logo} alt = "Logo" width = "null" height = "60" />
                    </Box>
                </Grid>
                <Grid item style = {{marginTop: "7px"}}>
                    <Link to = {`${match.url}/inbox`} style={{ textDecoration: 'none', color: 'white' }}> 
                        <IconButton size="large" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                    </Link>
                    <IconButton size="large" color="inherit">
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Link to = {`${match.url}/profile`} style={{ textDecoration: 'none', color: 'white' }}>
                        <IconButton color = "inherit" size = "large">
                            <AccountBoxIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick = {Logout} color = "inherit" size = "large">
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
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Reporting', 'Resources', 'Questionairre'].map((text, index) => (
            <Link to = {`${match.url}/${text}`} style={{ textDecoration: 'none', color: 'black' }}>
              <ListItem button key={text}>
                <ListItemIcon>
                        {(() => {
                        switch(text) {
                            case "Inbox": return <MailIcon />;
                            case "Reporting": return <CreateIcon />;
                            case "Resources": return <LibraryBooksIcon />;
                            case "Questionairre": return <QuestionAnswerIcon/>;                        }
                        })()}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
            ))}
          </List>
          <Divider />
          <List>
            {['Clock In', 'Upload Sessions'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <AccessTimeIcon /> : <UploadIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Switch>
            <Route path={`${match.path}/inbox`}>
                <Inbox />
            </Route>
            <Route path={`${match.path}/resources`}>
                <Resources />
            </Route>
            <Route path={`${match.path}/reporting`}>
                <Reporting />
            </Route>
            <Route path={`${match.path}/questionairre`}>
                <Questionairre />
            </Route>
            <Route path={`${match.path}/profile`}>
                <Profile />
            </Route>
        </Switch>
      </Box>
    </Box>
  );
}