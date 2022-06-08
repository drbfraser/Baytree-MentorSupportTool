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
  AllDayPanel
} from "@devexpress/dx-react-scheduler-material-ui";

const DesktopScheduler = () => {
  return (
    <Scheduler height="auto">
      <ViewState defaultCurrentViewName="Day" />
      <DayView startDayHour={9} endDayHour={17} />
      <WeekView startDayHour={9} endDayHour={17} />
      <MonthView />
      <Toolbar />
      <AllDayPanel />
      <DateNavigator />
      <TodayButton />
      <ViewSwitcher />
    </Scheduler>
  );
};

export default DesktopScheduler;