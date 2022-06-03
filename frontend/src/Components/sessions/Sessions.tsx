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
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getAssociations,
  getParticipants,
  getVenues,
  Participant,
  Venue
} from "../../api/views";
import { useAuth } from "../../context/AuthContext";
import TitledContainer from "../shared/TitledContainer";
import useMentees from "./hooks/useMentees";
import useVenues from "./hooks/useVenues";
import { initialData, Mentee, submitSession } from "./session";

// Reponsive container for time
const TimeInputContainer: FunctionComponent<{ label: string }> = ({
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
const SelectInputContainer: FunctionComponent<{ label: string }> = ({
  label,
  children
}) => {
  return (
    <Grid container item xs={12} sm={6} alignItems="center">
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

const SessionForm = () => {
  const { user } = useAuth();

  const setFieldValueRef =
    useRef<
      (field: string, value: any, shouldValidate?: boolean | undefined) => void
    >();

  const { venues, isLoadingVenues } = useVenues(setFieldValueRef);
  const { mentees, isLoadingMentees } = useMentees(setFieldValueRef);

  return (
    <>
      <TitledContainer title="Create Session">
        <Formik
          initialValues={initialData()}
          onSubmit={async (data, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const success = await submitSession(data);
            if (success) resetForm();
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => {
            setFieldValueRef.current = setFieldValue;
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
                        onChange={(value) => setFieldValue("date", value, true)}
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
                    {isLoadingMentees ? (
                      <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                      </>
                    ) : (
                      <Select
                        labelId="Mentee"
                        id="Mentee"
                        value={values.menteeViewsPersonId}
                        label="Mentee"
                        onChange={(event) =>
                          setFieldValue(
                            "menteeViewsPersonId",
                            event.target.value,
                            true
                          )
                        }
                      >
                        {mentees.map((mentee, i) => (
                          <MenuItem key={i} value={mentee.id}>
                            {mentee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </SelectInputContainer>
                  <SelectInputContainer label="Venue">
                    {isLoadingVenues ? (
                      <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                      </>
                    ) : (
                      <Select
                        labelId="Venue"
                        id="Venue"
                        value={values.viewsVenueId}
                        label="Venue"
                        onChange={(event) =>
                          setFieldValue(
                            "viewsVenueId",
                            event.target.value,
                            true
                          )
                        }
                      >
                        {venues.map((venue, i) => (
                          <MenuItem key={i} value={venue.id}>
                            {venue.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </SelectInputContainer>
                </Grid>
                <Divider />
                {isSubmitting ? (
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                ) : (
                  <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                    Submit
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      </TitledContainer>
    </>
  );
};

export default SessionForm;
