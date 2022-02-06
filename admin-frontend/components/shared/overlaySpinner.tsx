import { Backdrop, CircularProgress } from "@mui/material";
import { BAYTREE_PRIMARY_COLOR } from "../../context/constants";

interface OverlaySpinnerProps {
  active: boolean;
  handleClose: () => void;
}

const OverlaySpinner: React.FC<OverlaySpinnerProps> = (props) => {
  return (
    <Backdrop
      style={{ color: BAYTREE_PRIMARY_COLOR, fontSize: "12rem" }}
      open={props.active}
      onClick={props.handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default OverlaySpinner;
