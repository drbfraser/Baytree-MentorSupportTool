import { useState } from "react";

import Statistics from "./Statistics";
import Scheduler from "./Scheduler";
import MenteeInfo from "./MenteeInfo";

import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";

import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import GoalList from "../goals/GoalsList";

const Home = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      <Container maxWidth="xl" sx={{ pt: 0.5, mt: 0 }}>
        {checked === false && (
          <Grow in={!checked}>
            <div>
              <Scheduler height="80vh" />
            </div>
          </Grow>
        )}
        {checked === true && (
          <Grid container spacing={5}>
            <Grid item xs={8}>
              <Grow in={checked}>
                <div>
                  <Scheduler height="55vh" />
                </div>
              </Grow>
              <Grow in={checked}>
                <div>
                  <Statistics />
                </div>
              </Grow>
            </Grid>
            <Grid item xs={4}>
              <Grow in={checked}>
                <div>
                  <MenteeInfo />
                </div>
              </Grow>
              <Grow in={checked}>
                <div>
                  <GoalList />
                </div>
              </Grow>
            </Grid>
          </Grid>
        )}

        <IconButton
          color="inherit"
          size="large"
          onClick={handleChange}
          sx={{ position: "absolute", bottom: 10, right: 5 }}
        >
          {checked === true && <OpenInFullIcon />}
          {checked === false && <CloseFullscreenIcon />}
        </IconButton>
      </Container>
    </div>
  );
};

export default Home;
