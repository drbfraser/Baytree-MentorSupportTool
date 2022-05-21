import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AppBar, Badge, Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { FunctionComponent, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assets/baytree.png";
import Messages from "../Messages";

const NavigationButton = (props: PropsWithChildren<{ action?: (() => void) | (() => Promise<void>) }>) => {
  return <IconButton children={props.children} size="large" onClick={props.action} />
}

const NavigationBar: FunctionComponent<{ drawerWidth: number, toggleDrawer: () => void }> = ({ drawerWidth, toggleDrawer }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "white",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}>
      <Toolbar>
        {/* Hamburger buttons and miniture logo in mobile version */}
        <Box sx={{ mr: 2, display: { xs: "flex", md: "none", sm: "flex" }, alignItems: "center" }}>
          <IconButton
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <img src={Logo} height={32} alt="Baytree Logo" />
        </Box>
        
        {/* Title */}
        <Typography variant="h6" color="primary">
          Mentor Portal
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Top-right navigation buttons */}
        <Stack direction="row">
          <Messages />
          <NavigationButton action={() => navigate('/dashboard/notifications')}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </NavigationButton>
          <NavigationButton action={() => navigate('/dashboard/profile')}>
            <AccountBoxIcon />
          </NavigationButton>
          <NavigationButton>
            <LogoutIcon color="secondary" />
          </NavigationButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar;