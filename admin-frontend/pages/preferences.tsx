import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { NextPage } from 'next'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { toast } from 'react-toastify'
import usePreferences from '../hooks/usePreferences'
import OverlaySpinner from '../components/shared/overlaySpinner'

const DEFAULT_MINIMUM_ACTIVE_DAYS = '5'
const DEFAULT_SEARCHING_DURATION_IN_DAYS = '30'

const Preferences: NextPage = () => {
  const { loading, preferences, handleUpdatePreferences } = usePreferences()

  return (
    <PreferencesCard>
      <PreferencesTitle variant="h5">Admin Preferences</PreferencesTitle>
      {loading ? (
        <OverlaySpinner active={loading} />
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            searchingDurationInDays:
              preferences == null
                ? DEFAULT_SEARCHING_DURATION_IN_DAYS
                : preferences[0].value,
            minimumActiveDays:
              preferences == null
                ? DEFAULT_MINIMUM_ACTIVE_DAYS
                : preferences[1].value
          }}
          onSubmit={async (data, { resetForm, setSubmitting }) => {
            if (parseInt(data.searchingDurationInDays) < 0) {
              data.searchingDurationInDays =
                preferences == null
                  ? DEFAULT_SEARCHING_DURATION_IN_DAYS
                  : preferences[0].value
              toast.info(
                'Cannot set searching duration in days to less than 0. Using Current days instead.'
              )
            }
            if (parseInt(data.minimumActiveDays) < 0) {
              data.minimumActiveDays =
                preferences == null
                  ? DEFAULT_MINIMUM_ACTIVE_DAYS
                  : preferences[1].value
              toast.info(
                'Cannot set minimum active days to less than 0. Using Current days instead.'
              )
            }
            setSubmitting(true)
            const success = await handleUpdatePreferences(data)
            if (success) {
              toast.success('Form successfully submitted!')
              resetForm()
            } else {
              toast.error('Could not submit preference change.')
            }
            setSubmitting(false)
          }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                {preferences == null ? (
                  <div></div>
                ) : (
                  preferences.map((preference, index) => {
                    return (
                      <FormControl
                        key={preference.key}
                        fullWidth
                        required={false}
                        style={{ margin: '2em 0' }}
                      >
                        {/* Preference label */}
                        <Typography
                          style={{ display: 'inline-block' }}
                          sx={{ fontWeight: 'bold' }}
                          color="text.secondary"
                        >
                          {`${index + 1}. ${
                            preference.key == 'searchingDurationInDays'
                              ? ' Searching Duration in Days'
                              : 'Minimum Active Days'
                          }`}
                        </Typography>
                        {/* Current Days */}
                        <Typography
                          sx={{ fontWeight: 'normal' }}
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
                          label={'Number of Days'}
                          onChange={handleChange}
                        />
                      </FormControl>
                    )
                  })
                )}
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Submit
                </Button>
              </Form>
            )
          }}
        </Formik>
      )}
    </PreferencesCard>
  )
}

const PreferencesCard = styled(Paper)`
  padding: 2rem;
`

const PreferencesTitle = styled(Typography)`
  margin-bottom: 1rem;
`

export default Preferences
