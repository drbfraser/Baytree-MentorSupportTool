import { ViewState } from "@devexpress/dx-react-scheduler";
import { AllDayPanel, Appointments, DateNavigator, DayView, MonthView, Scheduler, TodayButton, Toolbar, ViewSwitcher, WeekView } from "@devexpress/dx-react-scheduler-material-ui";
import { Paper, useMediaQuery, useTheme } from "@mui/material";
import useScheduler from "../../hooks/useScheduler";

const HomeScheduler = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const { events } = useScheduler();

  return (
    <Paper elevation={4} sx={{ mb: 3, height: "55vh" }}>
      <Scheduler data={events} height="auto">
        <ViewState defaultCurrentViewName="Day" currentViewName={!isDesktop ? "Day" : undefined} />

        <DayView startDayHour={9} endDayHour={17} />
        {isDesktop && <WeekView startDayHour={9} endDayHour={17} />}
        {isDesktop && <MonthView />}
        {isDesktop && <Appointments />}

        <Toolbar />
        <AllDayPanel />
        <DateNavigator />
        <TodayButton />
        {isDesktop && <ViewSwitcher />}
      </Scheduler>
    </Paper>
  )
};

export default HomeScheduler;