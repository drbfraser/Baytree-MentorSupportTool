import { Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/auth/actionCreators";
import { ModalComponent } from "../Modal";

const LogoutModal: ModalComponent = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Are you sure that you want to logout?
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: props.useMobileLayout ? "column" : "row",
          justifyContent: "space-around",
          paddingTop: "3rem",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            await dispatch(logout());
            router.push("/");
          }}
          style={{ marginBottom: props.useMobileLayout ? "3rem" : "0" }}
        >
          Log out
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            props.onOutsideClick();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default LogoutModal;
