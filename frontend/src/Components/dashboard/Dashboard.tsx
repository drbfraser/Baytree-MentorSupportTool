import { Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import SideMenu from "./SideMenu";

const drawerWidth = 240;

const Dashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setIsMobileOpen((open) => !open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationBar
        drawerWidth={drawerWidth}
        toggleDrawer={toggleMobileDrawer}
      />
      <SideMenu
        drawerWidth={drawerWidth}
        mobileDrawerOpened={isMobileOpen}
        toggleMobileDrawer={toggleMobileDrawer}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {/* The main content of the application */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
