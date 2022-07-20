import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 0"
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Loading;
