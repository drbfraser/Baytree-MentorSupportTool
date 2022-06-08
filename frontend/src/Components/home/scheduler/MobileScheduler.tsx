import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  DayView,
  Scheduler,
  Toolbar,
  DateNavigator,
  TodayButton,
  AllDayPanel
} from "@devexpress/dx-react-scheduler-material-ui";

const MobileScheduler = () => {
  return (
    <Scheduler height="auto">
      <ViewState />
      <DayView startDayHour={9} endDayHour={17} />
      <Toolbar />
      <AllDayPanel />
      <DateNavigator />
      <TodayButton />
    </Scheduler>
  );
};

export default MobileScheduler;