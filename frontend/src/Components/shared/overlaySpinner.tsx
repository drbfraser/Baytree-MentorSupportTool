import { Backdrop, CircularProgress } from "@mui/material";
import { BAYTREE_PRIMARY_COLOR } from "../../constants/constants";

interface OverlaySpinnerProps {
  active: boolean;
  onClick?: () => void;
  element?: any;
}

const OverlaySpinner: React.FC<OverlaySpinnerProps> = (props) => {
  return (
    <Backdrop
      style={{ color: BAYTREE_PRIMARY_COLOR, fontSize: "12rem" }}
      open={props.active}
      component={props.element ?? undefined}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default OverlaySpinner;
