import {
  Box,
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { type FunctionComponent, useEffect, useState } from 'react'
import {
  MdAutoGraph,
  MdBook,
  MdCreate,
  MdHome,
  MdLibraryBooks,
  MdNotifications,
  MdPermDeviceInformation,
  MdQuestionAnswer
} from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { fetchResourcesURL } from '../../api/misc'
import BaytreeLogoHorizontal from '../../Assets/baytree-logo-horizontal.png'

const navigationLinkItems = [
  { title: 'Home', icon: MdHome, path: '/dashboard/home' },
  { title: 'Create Session', icon: MdCreate, path: '/dashboard/sessions' },
  {
    title: 'Questionnaires',
    icon: MdQuestionAnswer,
    path: '/dashboard/questionnaires'
  },
  { title: 'Goals', icon: MdAutoGraph, path: '/dashboard/goals' },
  { title: 'Records', icon: MdBook, path: '/dashboard/records' },
  {
    title: 'Notifications',
    icon: MdNotifications,
    path: '/dashboard/notifications'
  }
]

type SideMenuProps = {
  drawerWidth: number
  mobileDrawerOpened: boolean
  closeDrawer: () => void
}

const SideMenu: FunctionComponent<SideMenuProps> = ({
  drawerWidth,
  mobileDrawerOpened,
  closeDrawer
}) => {
  const [resourcesURL, setResourcesURL] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()

  useEffect(() => {
    // Fetch the resources URL
    fetchResourcesURL().then(setResourcesURL)
  }, [])

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 }
      }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          display: {
            xs: !isMobile ? 'none' : 'block',
            sm: !isMobile ? 'none' : 'block',
            md: isMobile ? 'none' : 'block'
          }
        }}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        open={mobileDrawerOpened}
        onClose={closeDrawer}
      >
        <Toolbar>
          <img src={BaytreeLogoHorizontal} alt="Baytree Logo" height={48} />
        </Toolbar>
        <Divider />
        {/* Navigation inside the website */}
        <List>
          {navigationLinkItems.map(({ title, path, icon }) => {
            const active = location.pathname === path

            return (
              <Link
                key={title}
                to={path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  button
                  onClick={closeDrawer}
                  sx={{
                    backgroundColor: active
                      ? 'rgba(90, 184, 1, 0.15)'
                      : 'transparent'
                  }}
                >
                  <ListItemIcon>
                    <Icon
                      color={active ? 'secondary' : 'primary'}
                      component={icon}
                    />
                  </ListItemIcon>
                  <ListItemText>{title}</ListItemText>
                </ListItem>
              </Link>
            )
          })}
        </List>
        <Divider />
        {/* Navigation outside the website */}
        <ListItem button component="a" target="_blank" href={resourcesURL}>
          <ListItemIcon>
            <Icon component={MdLibraryBooks} color="primary" />
          </ListItemIcon>
          <ListItemText>Resources</ListItemText>
        </ListItem>
        <ListItem
          button
          component="a"
          href="mailto: volunteering@baytreecentre.org.uk"
          target="_blank"
        >
          <ListItemIcon>
            <Icon component={MdPermDeviceInformation} color="primary" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </ListItem>
      </Drawer>
    </Box>
  )
}

export default SideMenu
