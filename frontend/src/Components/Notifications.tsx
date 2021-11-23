import * as React from 'react';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import GroupIcon from '@mui/icons-material/Group';
import { ListItemText, Typography } from '@mui/material';

export default function Notifications() {
  
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
            <Badge badgeContent={2} color="error">
                <NotificationsIcon />
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
            <QuestionAnswerIcon sx = {{mr: 2}}/>
            <ListItemText
                primary = "New Monthly Report Available"
                secondary = {
                  <React.Fragment>
                      <Typography sx={{ display: 'inline' }} variant = "caption" color="text.secondary" gutterBottom>
                          Complete by 26 Nov, 2021
                      </Typography>
                  </React.Fragment>
                }>
            </ListItemText>
          </MenuItem>
            <Divider />
          <MenuItem onClick={handleClose}>
            <GroupIcon sx = {{mr: 2}}/>
            <ListItemText
                primary = "Mentor Session in 2 days"
                secondary = {
                  <React.Fragment>
                      <Typography sx={{ display: 'inline' }} variant = "caption" color="text.secondary" gutterBottom>
                          Mentor session at 23 Nov, 2021 at the Baytree Centre
                      </Typography>
                  </React.Fragment>
                }>
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
    );
};

