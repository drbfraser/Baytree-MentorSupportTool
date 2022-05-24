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
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../api/url";
import BaytreeLogoHorizontal from "../../Assets/baytree-logo-horizontal.png";

const navigationLinkItems = [
  { title: "Home", Icon: HomeIcon, path: "/dashboard/home" },
  { title: "Create Session", Icon: CreateIcon, path: "/dashboard/sessions" },
  {
    title: "Questionnaires",
    Icon: QuestionAnswerIcon,
    path: "/dashboard/questionnaires"
  },
  { title: "Goals", Icon: AutoGraphIcon, path: "/dashboard/goals" },
  { title: "Records", Icon: BookIcon, path: "/dashboard/records" },
  {
    title: "Notifications",
    Icon: NotificationsIcon,
    path: "/dashboard/notifications"
  }
];

interface SideMenuProps {
  drawerWidth: number;
  mobileDrawerOpened: boolean;
  closeDrawer: () => void;
}

const SideMenu: FunctionComponent<SideMenuProps> = ({
  drawerWidth,
  mobileDrawerOpened,
  closeDrawer
}) => {
  const [resourcesURL, setResourcesURL] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

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
        onClose={closeDrawer}
      >
        <Toolbar>
          <img src={BaytreeLogoHorizontal} alt="Baytree Logo" height={48} />
        </Toolbar>
        <Divider />
        {/* Navigation inside the website */}
        <List>
          {navigationLinkItems.map(({ title, path, Icon }) => {
            const active = location.pathname === path;

            return (
              <Link
                key={title}
                to={path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem button onClick={closeDrawer}>
                  <ListItemIcon>
                    <Icon color={active ? "secondary" : "primary"} />
                  </ListItemIcon>
                  <ListItemText>{title}</ListItemText>
                </ListItem>
              </Link>
            );
          })}
        </List>
        <Divider />
        {/* Navigation outside the website */}
        <ListItem button component="a" target="_blank" href={resourcesURL}>
          <ListItemIcon>
            <LibraryBooksIcon color="primary" />
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
            <PermDeviceInformationIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </ListItem>
      </Drawer>
    </Box>
  );
};

export default SideMenu;
