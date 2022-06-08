import { Paper, useMediaQuery, useTheme } from "@mui/material";
import { SchedulerProvider } from "../../../context/SchedulerContext";
import DesktopScheduler from "./DesktopScheduler";
import MobileScheduler from "./MobileScheduler";

const HomeScheduler = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <SchedulerProvider>
      <Paper elevation={4} sx={{ mb: 3, height: "55vh" }}>
        {!isDesktop ? <MobileScheduler /> : <DesktopScheduler />}
      </Paper>
    </SchedulerProvider>
  )
};

export default HomeScheduler;