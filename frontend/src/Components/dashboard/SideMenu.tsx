import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BookIcon from "@mui/icons-material/Book";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/url";
import BaytreeLogoHorizontal from "../../Assets/baytree-logo-horizontal.png";

const navigationLinkItems = [
  {
    title: "Home",
    icon: <HomeIcon color="secondary" />,
    path: "/dashboard/home"
  },
  {
    title: "Create Session",
    icon: <CreateIcon color="secondary" />,
    path: "/dashboard/sessions"
  },
  {
    title: "Questionnaires",
    icon: <QuestionAnswerIcon color="secondary" />,
    path: "/dashboard/questionnaires"
  },
  {
    title: "Goals",
    icon: <AutoGraphIcon color="secondary" />,
    path: "/dashboard/goals"
  },
  {
    title: "Records",
    icon: <BookIcon color="secondary" />,
    path: "/dashboard/records"
  },
  {
    title: "Notifications",
    icon: <NotificationsIcon color="secondary" />,
    path: "/dashboard/notifications"
  }
];

interface SideMenuProps {
  drawerWidth: number;
  mobileDrawerOpened: boolean;
  toggleMobileDrawer: () => void;
}

const SideMenu: FunctionComponent<SideMenuProps> = ({
  drawerWidth,
  mobileDrawerOpened,
  toggleMobileDrawer
}) => {
  const [resourcesURL, setResourcesURL] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Fetch the resources URL
    fetch(`${API_BASE_URL}/resources/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        setResourcesURL(JSON.parse(data)[0].Resource);
      });
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        backgroundColor: "primary.light"
      }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          display: {
            xs: !isMobile ? "none" : "block",
            sm: !isMobile ? "none" : "block",
            md: isMobile ? "none" : "block"
          }
        }}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        open={mobileDrawerOpened}
        onClose={toggleMobileDrawer}
      >
        <Toolbar>
          <img src={BaytreeLogoHorizontal} alt="Baytree Logo" height={48} />
        </Toolbar>
        <Divider />
        <List>
          {navigationLinkItems.map(({ title, icon, path }) => (
            <Link
              key={title}
              to={path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem button>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <ListItem button component="a" target="_blank" href={resourcesURL}>
          <ListItemIcon>
            <LibraryBooksIcon color="secondary" />
          </ListItemIcon>
          <ListItemText>Resources</ListItemText>
        </ListItem>
        <ListItem
          button
          component="a"
          href="mailto: federica@baytreecentre.org.uk"
          target="_blank"
        >
          <ListItemIcon>
            <PermDeviceInformationIcon color="secondary" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </ListItem>
      </Drawer>
    </Box>
  );
};

export default SideMenu;
