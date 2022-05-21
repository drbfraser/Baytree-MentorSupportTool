import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BookIcon from "@mui/icons-material/Book";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import BaytreeLogoHorizontal from "../../Assets/baytree-logo-horizontal.png";

const navigationLinkItems = [
  { title: "Home", icon: <HomeIcon color="secondary" />, path: "/dashboard/home" },
  { title: "Create Session", icon: <CreateIcon color="secondary" />, path: "/dashboard/sessions" },
  { title: "Questionnaires", icon: <QuestionAnswerIcon color="secondary" />, path: "/dashboard/questionnaires" },
  { title: "Goals", icon: <AutoGraphIcon color="secondary" />, path: "/dashboard/goals" },
  { title: "Records", icon: <BookIcon color="secondary" />, path: "/dashboard/records" },
  { title: "Notifications", icon: <NotificationsIcon color="secondary" />, path: "/dashboard/notifications" },
];

const drawerContent = (
  <>
    <Toolbar>
      <img src={BaytreeLogoHorizontal} alt="Baytree Logo" height={48} />
    </Toolbar>
    <Divider />
    <List>
      {navigationLinkItems.map(({ title, icon, path }) => (
        <Link key={title} to={path}
          style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{title}</ListItemText>
          </ListItem>
        </Link>
      ))}
    </List>
    <Divider />
    <ListItem
      button
      component="a"
    >
      <ListItemIcon>
        <LibraryBooksIcon color="secondary" />
      </ListItemIcon>
      <ListItemText>Resources</ListItemText>
    </ListItem>
    <ListItem button component="a"
      href="mailto: federica@baytreecentre.org.uk"
      target="_blank"
    >
      <ListItemIcon>
        <PermDeviceInformationIcon color="secondary" />
      </ListItemIcon>
      <ListItemText>Help</ListItemText>
    </ListItem>
  </>)

interface SideMenuProps {
  drawerWidth: number,
  mobileDrawerOpened: boolean,
  toggleMobileDrawer: () => void
}

const SideMenu: FunctionComponent<SideMenuProps> = ({ drawerWidth, mobileDrawerOpened, toggleMobileDrawer }) => {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, backgroundColor: "primary.light" }}
    >
      {/* Pernament drawer - desktop version */}
      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          },
          display: { xs: "none", sm: "none", md: "block" }
        }}
        variant="permanent"
      >
        {drawerContent}
      </Drawer>

      {/* Temporary drawer - mobile version */}
      {/* Note, may use a script for responsive style */}
      <Drawer
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        variant="temporary"
        open={mobileDrawerOpened}
        onClose={toggleMobileDrawer}
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default SideMenu;