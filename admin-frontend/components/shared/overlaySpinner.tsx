import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

interface OverlaySpinnerProps {
  active: boolean;
  onClick?: () => void;
  element?: any;
}

const OverlaySpinner: React.FC<OverlaySpinnerProps> = (props) => {
  const primaryColor = useSelector<RootState, string>(
    (state) => state.theme.colors.primaryColor
  );

  return (
    <Backdrop
      style={{ color: primaryColor, fontSize: "12rem" }}
      open={props.active}
      onClick={props.onClick}
      component={props.element ?? undefined}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default OverlaySpinner;
