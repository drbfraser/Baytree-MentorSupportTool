import { Paper, useMediaQuery, useTheme } from "@mui/material";
import DesktopScheduler from "./DesktopScheduler";
import MobileScheduler from "./MobileScheduler";

const HomeScheduler = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return <Paper elevation={4} sx={{mb: 3, height: "55vh"}}>
    {!isDesktop ? <MobileScheduler /> : <DesktopScheduler />}
  </Paper>
};

export default HomeScheduler;