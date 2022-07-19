import { Alert, AlertTitle, Button, fabClasses, FormControl, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useQuestionnaire, {
  isMenteeQuestion,
  isMentorQuestion,
  isRequired
} from "../../hooks/useQuestionnaire";
import Loading from "../shared/Loading";
import TitledContainer from "../shared/TitledContainer";
import ChoiceInput, { isChoiceQuestion } from "./ChoiceInput";
import InvalidQuestionnaire from "./InvalidQuestionnaire";
import MenteesNameInput from "./MenteesNameInput";
import MentorNameInput from "./MentorNameQuestion";
import TextInput from "./TextInput";

const Questionnaire = () => {
  const [canSeeAlert, setcanSeeAlert] = useState("none");
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState(<></>);
  const [submissionErrorTitle, setSubmissionErrorTitle] = useState("Error");

  const {
    loading,
    questions,
    initialAnswer,
    validateAnswerSet,
    mentees,
    errorMessage,
    handleSubmitAnswerSet,
  } = useQuestionnaire();
  return (
    <TitledContainer title="Monthly Progress Report">
      {/* Start the form */}
      {loading ? (
        <Loading />
      ) : errorMessage() ? (
        <InvalidQuestionnaire error={errorMessage()} />
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialAnswer}
          onSubmit={async (answer, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const menteeResult = await handleSubmitAnswerSet(answer, "mentee");
            if (menteeResult) {
              const mentorResult = await handleSubmitAnswerSet(answer, "mentor");
              if (mentorResult){
                toast.success("Submitted successfully, thank you");
                resetForm();
              }
              else {
                const volunteerQuestionnaireSubmissionError = 
                <strong>Views Volunteer and Participant questionnaires may now be inconsistent. 
                  <br/>Please contact the administrator to manually remove inconsistent questionnaire from Participant's profile before trying again.</strong>;
                setSubmissionErrorTitle("Error: Failed to Submit Volunteer Questionnaire");
                setSubmissionErrorMessage(volunteerQuestionnaireSubmissionError);
                setcanSeeAlert("block");
                // TODO: implement server logging

                setSubmitting(false);
              }
            } else {
              const questionnaireSubmissionError = 
              <strong>Failed to submit Participant questionnaire, consequently, Volunteer answer set not submitted. Please try again.</strong>;
              setSubmissionErrorTitle("Error: Questionnaire Not Submitted");
              setSubmissionErrorMessage(questionnaireSubmissionError);
              setcanSeeAlert("block");
              // TODO: Implement server logging
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, handleChange }) => (
            <Form>
              {/* Questions */}
              {questions.map((question, index) => {
                const required = isRequired(question);
                return (
                  <FormControl
                    key={question.QuestionID}
                    fullWidth
                    required={required}
                    style={{ margin: "2em 0" }}
                  >
                    {/* Question labels */}
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      color="text.secondary"
                    >
                      {`${index + 1}. ${question.Question} ${
                        required ? "*" : ""
                      }`}
                    </Typography>
                    {/* Question input */}
                    {isMentorQuestion(question) ? (
                      <MentorNameInput question={question} />
                    ) : isMenteeQuestion(question) ? (
                      <MenteesNameInput
                        question={question}
                        menteeList={mentees!}
                      />
                    ) : isChoiceQuestion(question) ? (
                      <ChoiceInput question={question} />
                    ) : (
                      <TextInput question={question} />
                    )}
                  </FormControl>
                );
              })}
              {/* Error Message */}
              <div style={{display: canSeeAlert}}>
                <Alert style={{display: "flex"}} variant="outlined" severity="error">
                  <AlertTitle>{submissionErrorTitle}</AlertTitle>
                  {submissionErrorMessage}
                </Alert>
              </div>
              {/* Submit button */}
              <Button
                disabled={isSubmitting || !validateAnswerSet(values)}
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </TitledContainer>
  );
};

export default Questionnaire;
