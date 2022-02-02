import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { IconType } from "../icons";
import { ModalComponent } from "../Modal";

export interface TopbarAction {
  icon: IconType;
  modalComponent: ModalComponent;
  modalWidth?: string;
  modalHeight?: string;
  color?: string;
}

const LogoutModalComponent: ModalComponent = (props) => {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography variant="h5" style={{ flex: 1, textAlign: "center" }}>
        Are you sure that you want to logout?
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "3rem",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => router.push("/")}
        >
          Log out
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => props.onOutsideClick()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const topbarActions: TopbarAction[] = [
  {
    icon: "logout",
    modalComponent: LogoutModalComponent,
    modalHeight: "auto",
    color: "#ff0000",
  },
];

export default topbarActions;
