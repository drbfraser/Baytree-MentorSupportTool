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
            <Form>
            {preferences.map((preference, index) => {
                    return (
                    <FormControl
                        key={preference.id}
                        fullWidth
                        required={false}
                        style={{ margin: "2em 0" }}
                    >
                        {/* Preference label */}
                        <Typography
                        sx={{ fontWeight: "bold" }}
                        color="text.secondary"
                        >
                        {`${index + 1}. ${preference.key}`}
                        </Typography>
                        {/* Preference Text Field */}
                        <TextField
                            type="number"
                            sx={{ mt: 1 }}
                            variant="outlined"
                            label={preference.key == "searchingDurationInDays" ? " Searching Duration in Days" : "Minimum Active Days"}
                        />
                    </FormControl>
                    );
                })}
            <button type="submit">Submit</button>
            </Form>
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
