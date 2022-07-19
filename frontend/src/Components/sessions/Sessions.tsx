import { DatePicker, LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import TitledContainer from "../shared/TitledContainer";
import useMentees from "../../hooks/useMentees";
import useVenues from "../../hooks/useVenues";
import { getInitialFormValues, submitSession } from "./session";
import { SelectInputContainer, TimeInputContainer } from "./Containers";
import useActivities from "../../hooks/useActivities";
import Loading from "../shared/Loading";

const SessionForm = () => {
  const { venues, error: venuesLoadError } = useVenues();

  useEffect(() => {
    if (venuesLoadError) {
      toast.error(
        `Loading venue data failed. Reason: ${venuesLoadError}. Please try refreshing or contact an administrator.`,
        { autoClose: false }
      );
    }
  }, [venuesLoadError]);

  const { mentees, error: menteesLoadError } = useMentees();

  useEffect(() => {
    if (menteesLoadError) {
      toast.error(
        `Loading mentee data failed. Reason: ${menteesLoadError}. Please try refreshing or contact an administrator.`,
        { autoClose: false }
      );
    }
  }, [menteesLoadError]);

  const { activities, error: activitiesLoadError } = useActivities();
  useEffect(() => {
    if (activitiesLoadError) {
      toast.error(
        `Loading activity data failed. Reason: ${activitiesLoadError}. Please try refreshing or contact an administrator.`,
        { autoClose: false }
      );
    }
  }, [activitiesLoadError]);

  useEffect(() => () => toast.dismiss(), []);

  return (
    <>
      <TitledContainer title="Create Session">
        {mentees && venues && activities ? (
          <Formik
            initialValues={{
              ...getInitialFormValues(),
              menteeViewsPersonId:
                mentees.length > 0 ? mentees[0].viewsPersonId : "",
              viewsVenueId: venues.length > 0 ? venues[0].id : "",
              activity: activities.length > 0 ? activities[0] : ""
            }}
            onSubmit={async (data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              toast.info("Submitting your session, please wait.");
              const success = await submitSession(data);
              if (success) resetForm();
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, setFieldValue, isSubmitting }) => {
              return (
                <Form>
                  {/* Attendance check box */}
                  <FormControl
                    fullWidth
                    sx={{
                      py: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      color="text.secondary"
                    >
                      Check if the session did not take place?
                    </Typography>
                    <Field name="cancelled" as={Checkbox} />
                  </FormControl>
                  <Divider />
                  {values.cancelled && (
                    <Typography
                      sx={{ fontWeight: "bold", mt: 3, mb: 1 }}
                      color="text.secondary"
                    >
                      If you or the mentee did not attend the session, please
                      enter when the session was suppose to happen!
                    </Typography>
                  )}
                  {/* Date and time */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={1} sx={{ py: 2 }}>
                      <TimeInputContainer label="Date">
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          value={values.date}
                          onChange={(value) =>
                            setFieldValue("date", value, true)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TimeInputContainer>
                      <TimeInputContainer label="Clock In">
                        <TimePicker
                          value={values.clockIn}
                          onChange={(value) =>
                            setFieldValue("clockIn", value, true)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TimeInputContainer>
                      <TimeInputContainer label="Clock out">
                        <TimePicker
                          value={values.clockOut}
                          onChange={(value) =>
                            setFieldValue("clockOut", value, true)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TimeInputContainer>
                    </Grid>
                  </LocalizationProvider>
                  <Divider />
                  {/* Notes */}
                  <FormControl fullWidth sx={{ py: 2 }}>
                    <Typography
                      sx={{ fontWeight: "bold", mb: 2 }}
                      color="text.secondary"
                    >
                      {!values.cancelled
                        ? "Please enter your notes*"
                        : "If you or the mentee did not attend the session, please explain why*"}
                    </Typography>
                    <TextField
                      name="notes"
                      variant="outlined"
                      multiline
                      required
                      value={values.notes}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Divider />
                  {/* Venue and Mentee selection */}
                  <Grid container spacing={1} sx={{ py: 2 }}>
                    <SelectInputContainer label="Mentee">
                      <Select
                        labelId="Mentee"
                        name="menteeViewsPersonId"
                        required
                        value={values.menteeViewsPersonId}
                        onChange={handleChange}
                      >
                        {mentees.map((mentee) => (
                          <MenuItem key={mentee.viewsPersonId}
                           value={mentee.viewsPersonId}>
                            {`${mentee.firstName} ${mentee.lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </SelectInputContainer>
                    <SelectInputContainer label="Venue">
                      <Select
                        labelId="Venue"
                        name="viewsVenueId"
                        required
                        value={values.viewsVenueId}
                        label="Venue"
                        onChange={handleChange}
                      >
                        {venues.map((venue) => (
                          <MenuItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </SelectInputContainer>
                    <SelectInputContainer label="Activity">
                      <Select
                        labelId="activity"
                        name="activity"
                        required
                        value={values.activity}
                        label="Activity"
                        onChange={handleChange}
                      >
                        {activities.map((activity, i) => (
                          <MenuItem key={i} value={activity}>
                            {activity}
                          </MenuItem>
                        ))}
                      </Select>
                    </SelectInputContainer>
                  </Grid>
                  <Divider />
                  {/* Submit Session Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                  >
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        ) : menteesLoadError || venuesLoadError || activitiesLoadError ? (
          <Alert severity="error">
            <AlertTitle>We're sorry, this page is not working at the moment.</AlertTitle>
              Please refresh or contact your administrator. <br />
              Reason for error:
              {menteesLoadError || venuesLoadError || activitiesLoadError}
          </Alert>
        ) : (
          <Loading />
        )}
      </TitledContainer>
    </>
  );
};

export default SessionForm;
