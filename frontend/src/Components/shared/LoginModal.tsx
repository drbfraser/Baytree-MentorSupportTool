import { Typography, Button } from "@mui/material";
import useMobileLayout from "../../hooks/useMobileLayout";

interface AddLoginModalProps {
  onOutsideClick: () => void;
  onLoginClick: () => void;
  onLogOut: () => void;
}

const LoginModal: React.FC<AddLoginModalProps> = (props) => {
    const onMobileDevice = useMobileLayout();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "fit-content",
      }}
    >
      <Typography 
        variant = "subtitle1"
        style={{ 
          textAlign: "center",
          paddingTop: "3rem",
          }}>
        Our Data Protection Privacy statement explains how we look after your information and what we do with it, you can find a copy on our website or by asking a member of staff. We will save the information you provide on our systems, which are accessible to all our staff. Generally, the information you provide us will be treated as confidential amongst our staff, however, in certain circumstances, we may need to disclose some information to third parties (including, for example, the social services). By accessing our services, you confirm that you consent to the storage and use of your data.
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: onMobileDevice ? "column" : "row",
          justifyContent: "space-around",
          paddingTop: "3rem",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={props.onLoginClick}
          style={{ marginBottom: onMobileDevice ? "1rem" : "0" }}
        >
          Log in
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            console.log("cancelling the log in")
            props.onOutsideClick();
            props.onLogOut();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;
