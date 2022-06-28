import { Grid, Typography, FormControl } from "@mui/material";
import { FunctionComponent } from "react";

// Reponsive container for time
export const TimeInputContainer: FunctionComponent<{ label: string }> = ({
  label,
  children
}) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{children}</FormControl>
      </Grid>
    </Grid>
  );
};

// Reponsive container for select
export const SelectInputContainer: FunctionComponent<{ label: string }> = ({
  label,
  children
}) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{children}</FormControl>
      </Grid>
    </Grid>
  );
};
