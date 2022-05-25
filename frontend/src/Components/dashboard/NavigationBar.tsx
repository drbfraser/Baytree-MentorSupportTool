import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  FunctionComponent,
  PropsWithChildren,
  useState,
  useEffect,
  MouseEventHandler
} from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/url";
import Logo from "../../Assets/baytree.png";
import { useAuth } from "../../context/AuthContext";
import Messages from "./Messages";
import MobileMenu from "./MobileMenu";

const NavigationButton: FunctionComponent<{
  action?: MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  return (
    <IconButton
      sx={{ display: { xs: "none", sm: "inherit" } }}
      children={props.children}
      size="large"
      onClick={props.action}
    />
  );
};

const NavigationBar: FunctionComponent<{
  drawerWidth: number;
  openDrawer: () => void;
}> = ({ drawerWidth, openDrawer }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [numNotifications, setNumNotifications] = useState(0);

  useEffect(() => {
    // Fetch the number of unread notifications
    fetch(
      `${API_BASE_URL}/notifications/get_unread_count/?mentor_id=${
        user!.userId
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      }
    )
      .then((response) => response.json())
      .then((data) => setNumNotifications(data[0]))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [user]);

  const logout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "white",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` }
      }}
    >
      <Toolbar>
        {/* Hamburger buttons and miniture logo in mobile version */}
        <Box
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none", sm: "flex" },
            alignItems: "center"
          }}
        >
          <IconButton onClick={openDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <img src={Logo} height={32} alt="Baytree Logo" />
        </Box>

        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold" }} color="primary">
          Mentor Portal
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        {/* Top-right navigation buttons */}
        <Stack direction="row">
          <Messages />
          <NavigationButton action={() => navigate("/dashboard/notifications")}>
            <Badge badgeContent={numNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </NavigationButton>
          <NavigationButton action={() => navigate("/dashboard/profile")}>
            <AccountBoxIcon />
          </NavigationButton>
          <NavigationButton action={logout}>
            <LogoutIcon color="primary" />
          </NavigationButton>
          <MobileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
