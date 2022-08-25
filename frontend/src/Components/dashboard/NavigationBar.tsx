import {
  AppBar,
  Badge,
  Box, Icon, IconButton,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import type { FunctionComponent, MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import {
  MdAccountBox,
  MdLogout,
  MdMenu,
  MdNotifications
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchUnreadNotificationCountByUserId } from "../../api/notification";
import Logo from "../../Assets/baytree.png";
import { useAuth } from "../../context/AuthContext";
import MobileMenu from "./MobileMenu";

type NavigationButtonProps = {
  action?: MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode
}

const NavigationButton: FunctionComponent<NavigationButtonProps> = (props) => {
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
    fetchUnreadNotificationCountByUserId(user!.userId)
      .then(setNumNotifications)
      .catch((error) => console.error("Error:", error));
  }, []);

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
            <Icon component={MdMenu} />
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
          {/* <Messages /> */}
          <NavigationButton action={() => navigate("/dashboard/notifications")}>
            <Badge badgeContent={numNotifications} color="error">
              <Icon component={MdNotifications} />
            </Badge>
          </NavigationButton>
          <NavigationButton action={() => navigate("/dashboard/profile")}>
            <Icon component={MdAccountBox} />
          </NavigationButton>
          <NavigationButton action={logout}>
            <Icon component={MdLogout} color="secondary" />
          </NavigationButton>
          <MobileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
