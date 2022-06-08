import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  DayView,
  Scheduler,
  WeekView,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  MonthView,
  AllDayPanel,
  Appointments
} from "@devexpress/dx-react-scheduler-material-ui";
import { useScheduler } from "../../../context/SchedulerContext";

const DesktopScheduler = () => {
  const {events} = useScheduler();

  return (
    <Scheduler data={events} height="auto">
      <ViewState defaultCurrentViewName="Day" />
      
      <DayView startDayHour={9} endDayHour={17} />
      <WeekView startDayHour={9} endDayHour={17} />
      <MonthView />
      <Appointments />

      <Toolbar />
      <AllDayPanel />
      <DateNavigator />
      <TodayButton />
      <ViewSwitcher />
    </Scheduler>
  );
};

export default DesktopScheduler;