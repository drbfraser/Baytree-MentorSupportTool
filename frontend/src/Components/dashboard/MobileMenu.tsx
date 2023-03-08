import {
  Box, Divider, Icon, IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'
import { useState } from 'react'
import {
  MdAccountBox,
  MdLogout,
  MdMoreVert,
  MdNotifications
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MobileMenu = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClose = () => setAnchorEl(null)

  const onNavigate = (destination: string) => () => {
    handleClose()
    navigate(destination)
  }

  const logout = async () => {
    handleClose()
    const loggedOut = await signOut()
    loggedOut && navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ display: { sm: 'none' } }}>
      <IconButton size="large" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Icon component={MdMoreVert} />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={onNavigate('/dashboard/notifications')}>
          <ListItemIcon>
            <Icon component={MdNotifications} />
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
        </MenuItem>
        <MenuItem onClick={onNavigate('/dashboard/profile')}>
          <ListItemIcon>
            <Icon component={MdAccountBox} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Icon color="primary" component={MdLogout} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MobileMenu
