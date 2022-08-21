import { FormControl, Paper, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import { Formik, Form } from "formik";
import usePreferences from "../hooks/usePreferences";
import OverlaySpinner from "../components/shared/overlaySpinner";


export interface Preference {
    id: number,
    key: string,
    json_value: number
}

const Preferences: NextPage = () => {

const {
    loading,
    preferences,
    handleSubmitPreferences,
  } = usePreferences();

  return (
    <PreferencesCard>
      <PreferencesTitle variant="h5">Admin Preferences</PreferencesTitle>
      {loading ? ( <OverlaySpinner active={loading}/> ) :
        <Formik
            initialValues={{
                searchingDurationInDays: '',
                minimumActiveDays: '',
              }}
            onSubmit={async (answer, { resetForm, setSubmitting }) => {
                handleSubmitPreferences
            }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => {
            return (
              <Form
              >
              {preferences == null ? <div></div> :
              preferences.map((preference, index) => {
                return (
                <FormControl
                    key={preference.key}
                    fullWidth
                    required={false}
                    style={{ margin: "2em 0"}}
                >
                    {/* Preference label */}
                    <Typography 
                    style={{display: 'inline-block'}}
                    sx={{ fontWeight: "bold" }}
                    color="text.secondary"
                    >
                    {`${index + 1}. ${preference.key == "searchingDurationInDays" ? " Searching Duration in Days" : "Minimum Active Days"}`}
                    </Typography>
                    {/* Current Days */}
                    <Typography
                    sx={{ fontWeight: "normal"}}
                    color="text.secondary"
                    >
                    {`(Current: ${preference.value} days)`} 
                    </Typography>
                    {/* Preference Text Field */}
                    <TextField
                      id={preference.key}
                      type="number"
                      sx={{ mt: 1 }}
                      variant="outlined"
                      label={"Number of Days"}
                      onChange={handleChange}
                    />
                </FormControl>
                );
                  })}
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  >Submit
                </Button>
              </Form>
            );
          }}
        </Formik>
    }
    </PreferencesCard>
  );
};

const PreferencesCard = styled(Paper)`
  padding: 2rem;
`;

const PreferencesTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default Preferences;
