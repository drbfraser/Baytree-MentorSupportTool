import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MailIcon from '@mui/icons-material/Mail';
import { ListItemText, Typography } from '@mui/material';

import {deepOrange, deepPurple, green} from '@mui/material/colors';

export default function Messages() {
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  
    return (
      <div style={{ textDecoration: 'none', color: 'black' }}>
        <IconButton 
            size = "large" 
            color = "inherit" 
            onClick = {handleClick}
            aria-controls = "basic-menu"
            aria-haspopup = "true"
            aria-expanded = {open ? 'true' : undefined}
            >
            <Badge badgeContent={3} color="error">
                <MailIcon />
            </Badge>
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ bgcolor: deepOrange[500], mr: 2}}>B</Avatar>
            <ListItemText
                primary = "Brian F"
                secondary = {
                  <React.Fragment>
                      <Typography sx={{ display: 'inline' }} variant = "caption" color="text.secondary" gutterBottom>
                          Hi, Can you complete this by today? Its ...
                      </Typography>
                  </React.Fragment>
                }>
            </ListItemText>
          </MenuItem>
            <Divider />
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ bgcolor: deepPurple[500], mr: 2}}>J</Avatar>
            <ListItemText
                primary = "John S"
                secondary = {
                  <React.Fragment>
                      <Typography sx={{ display: 'inline' }} variant = "caption" color="text.secondary" gutterBottom>
                          I don't think i can make it for the next ...
                      </Typography>
                  </React.Fragment>
                }>
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ bgcolor: green[500], mr: 2}}>M</Avatar>
            <ListItemText
                primary = "Michael K"
                secondary = {
                  <React.Fragment>
                      <Typography sx={{ display: 'inline' }} variant = "caption" color="text.secondary" gutterBottom>
                            Can I get your advice on this thing I ...
                      </Typography>
                  </React.Fragment>
                }>
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
    );
};
