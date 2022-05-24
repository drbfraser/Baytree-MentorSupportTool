import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Badge, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileMenu = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);
  
  const onNavigate = (destination: string) => () => {
    handleClose();
    navigate(destination);
  }

  const logout = async () => {
    handleClose();
    const loggedOut = await signOut();
    loggedOut && navigate("/login", {replace: true});
  }

  return <Box sx={{display: {sm: "none"}}}>
    <IconButton size="large" onClick={(e) => setAnchorEl(e.currentTarget)}>
      <MoreVertIcon />
    </IconButton>
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
      <MenuItem onClick={onNavigate("/dashboard/notifications")}>
        <ListItemIcon >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText>Notifications</ListItemText>
      </MenuItem>
      <MenuItem onClick={onNavigate("/dashboard/profile")}>
        <ListItemIcon ><AccountBoxIcon /></ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        <ListItemIcon ><LogoutIcon color="primary" /></ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  </Box>
}

export default MobileMenu;