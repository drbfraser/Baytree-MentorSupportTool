import { Grid, Typography, FormControl } from "@mui/material";

export interface TimeInputContainerProps {
  label: string,
  children: React.ReactNode
}

// Reponsive container for time
export const TimeInputContainer = (props: TimeInputContainerProps) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{props.children}</FormControl>
      </Grid>
    </Grid>
  );
};

export interface SelectInputContainerProps {
  label: string,
  children: React.ReactNode
}

// Reponsive container for select
export const SelectInputContainer = (props: SelectInputContainerProps) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{props.children}</FormControl>
      </Grid>
    </Grid>
  );
};
