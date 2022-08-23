import { Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../Components/dashboard/NavigationBar";
import SideMenu from "../Components/dashboard/SideMenu";

const drawerWidth = 240;

const Dashboard = () => {
  const [isDrawerOpen, setIsMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationBar
        drawerWidth={drawerWidth}
        openDrawer={() => setIsMobileOpen(true)}
      />
      <SideMenu
        drawerWidth={drawerWidth}
        mobileDrawerOpened={isDrawerOpen}
        closeDrawer={() => setIsMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {/* The main content of the application */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
