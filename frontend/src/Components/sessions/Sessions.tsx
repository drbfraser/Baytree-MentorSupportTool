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
import { useRef } from "react";
import { toast } from "react-toastify";
import TitledContainer from "../shared/TitledContainer";
import useMentees, {
  OnMenteesFailedToLoadReason
} from "../../hooks/useMentees";
import useVenues, { OnVenuesFailedToLoadReason } from "../../hooks/useVenues";
import { getInitialFormValues, Mentee, submitSession } from "./session";
import { Venue } from "../../api/views";
import { SelectInputContainer, TimeInputContainer } from "./Containers";

const SessionForm = () => {
  // Used for setting formik field values outside of the form component
  const setFieldValueRef =
    useRef<
      (field: string, value: any, shouldValidate?: boolean | undefined) => void
    >();

  // Autofill venues select field once venues loaded
  const onVenuesLoaded = (venues: Venue[]) => {
    if (venues.length > 0) {
      if (setFieldValueRef.current) {
        setFieldValueRef.current("viewsVenueId", venues[0].id, true);
      }
    }
  };

  const onVenuesFailedToLoad = (reason: OnVenuesFailedToLoadReason) => {
    toast.error(
      `Loading venue data failed. Reason: ${reason}. Please try refreshing or contact an administrator.`
    );
  };

  const { venues, isLoadingVenues } = useVenues({
    onVenuesLoaded,
    onVenuesFailedToLoad
  });

  // Autofill mentees select field once mentees loaded
  const onMenteesLoaded = (mentees: Mentee[]) => {
    if (mentees.length > 0) {
      if (setFieldValueRef.current) {
        setFieldValueRef.current("menteeViewsPersonId", mentees[0].id, true);
      }
    }
  };

  const onMenteesFailedToLoad = (reason: OnMenteesFailedToLoadReason) => {
    toast.error(
      `Loading mentee data failed. Reason: ${reason}. Please try refreshing or contact an administrator.`
    );
  };

  const { mentees, isLoadingMentees } = useMentees({
    onMenteesLoaded,
    onMenteesFailedToLoad
  });

  return (
    <>
      <TitledContainer title="Create Session">
        <Formik
          initialValues={getInitialFormValues()}
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
      </TitledContainer>
    </>
  );
};

export default SessionForm;
