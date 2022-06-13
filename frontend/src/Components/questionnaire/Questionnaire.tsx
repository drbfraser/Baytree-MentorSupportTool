import { Button, FormControl, Typography } from "@mui/material";
import { Form, Formik } from "formik";
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
  const {
    loading,
    questions,
    initialAnswer,
    validateAnswerSet,
    mentees,
    errorMessage,
    handleSubmitAnswerSet,
    handleDeleteAnswerSet,
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
                toast.error("Failed to submit Volunteer questionnaire, please try again");
                toast.error("Removing Participant questionnaire.");
                // TODO: Implement when certain of admin authorization to delete questionnaire answer sets
                // const deleteResult = await handleDeleteAnswerSet(answer, "mentee");
                const deleteResult = false;
                if (!deleteResult) {
                  toast.error("Participant questionnaire could not be removed. \
                  Views Volunteer and Participant questionnaires may now be inconsistent. \
                  Please contact the administrator to manually remove inconsistent \
                  questionnaire from Participant.");
                }
                setSubmitting(false);
              }
            } else {
              toast.error("Failed to submit Participant questionnaire. \
                          Volunteer answer set not submitted, please try again");
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
