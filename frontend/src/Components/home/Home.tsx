import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import GoalList from "../goals/GoalsList";
import MenteeInfo from "./MenteeInfo";
import Scheduler from "./Scheduler";
import Statistics from "./Statistics";





const Home = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      <Container maxWidth="xl" sx={{ pt: 0.5, mt: 0 }}>
        {!checked && (
          <Grow in={!checked}>
            <div>
              <Scheduler height="80vh" />
            </div>
          </Grow>
        )}
        {checked && (
          <Grow in={checked}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={12} lg={8}>
                <Scheduler height="55vh" />
                <Statistics />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <MenteeInfo />
                <GoalList />
              </Grid>
            </Grid>
          </Grow>
        )}

        <IconButton
          color="inherit"
          size="large"
          onClick={handleChange}
          sx={{ position: "fixed", bottom: 10, right: 5 }}
        >
          {checked === true && <OpenInFullIcon />}
          {checked === false && <CloseFullscreenIcon />}
        </IconButton>
      </Container>
    </div>
  );
};

export default Home;
