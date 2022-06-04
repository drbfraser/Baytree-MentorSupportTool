import { DatePicker, LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Skeleton,
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

  return (
    <>
      <TitledContainer title="Create Session">
        {mentees && venues ? (
          <Formik
            initialValues={{
              ...getInitialFormValues(),
              menteeViewsPersonId: mentees.length > 0 ? mentees[0].id : "",
              viewsVenueId: venues.length > 0 ? venues[0].id : ""
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
                          inputFormat="MM/dd/yyyy"
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
                        value={values.menteeViewsPersonId}
                        label="Mentee"
                        onChange={handleChange}
                      >
                        {mentees.map((mentee, i) => (
                          <MenuItem key={i} value={mentee.id}>
                            {mentee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </SelectInputContainer>
                    <SelectInputContainer label="Venue">
                      <Select
                        labelId="Venue"
                        name="viewsVenueId"
                        value={values.viewsVenueId}
                        label="Venue"
                        onChange={handleChange}
                      >
                        {venues.map((venue, i) => (
                          <MenuItem key={i} value={venue.id}>
                            {venue.name}
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
        ) : menteesLoadError || venuesLoadError ? (
          <>
            <Typography>
              We're sorry, this page is not working at the moment. Please
              refresh or contact your administrator. Reason for error:{" "}
              {menteesLoadError ? menteesLoadError : venuesLoadError}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
      </TitledContainer>
    </>
  );
};

export default SessionForm;
