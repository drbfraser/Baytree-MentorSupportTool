import {
  Avatar,
  Badge,
  Divider,
  Icon,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import { deepOrange, deepPurple, green } from '@mui/material/colors'
import { useState } from 'react'
import { MdMail } from 'react-icons/md'

export default function Messages() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div style={{ textDecoration: 'none', color: 'black' }}>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={3} color="error">
          <Icon component={MdMail} />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ bgcolor: deepOrange[500], mr: 2 }}>B</Avatar>
          <ListItemText
            primary="Brian F"
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Hi, Can you complete this by today? Its ...
                </Typography>
              </>
            }
          ></ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ bgcolor: deepPurple[500], mr: 2 }}>J</Avatar>
          <ListItemText
            primary="John S"
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  I don&apos;t think i can make it for the next ...
                </Typography>
              </>
            }
          ></ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ bgcolor: green[500], mr: 2 }}>M</Avatar>
          <ListItemText
            primary="Michael K"
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Can I get your advice on this thing I ...
                </Typography>
              </>
            }
          ></ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}
