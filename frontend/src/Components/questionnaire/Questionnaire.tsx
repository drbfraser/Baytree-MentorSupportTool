import { Button, FormControl, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useQuestionnaire, { isMenteeQuestion, isMentorQuestion, isRequired } from "../../hooks/useQuestionnaire";
import Loading from "../shared/Loading";
import TitledContainer from "../shared/TitledContainer";
import ChoiceInput, { isChoiceQuestion } from "./ChoiceInput";
import InvalidQuestionnaire from "./InvalidQuestionnaire";
import MenteesNameInput from "./MenteesNameInput";
import MentorNameInput from "./MentorNameQuestion";
import TextInput from "./TextInput";

const Questionnaire = () => {
  const { loading, questions, initialAnswer, validateAnswerSet, mentees, errorMessage, handleSubmitAnswerSet } = useQuestionnaire();
  return (
    <TitledContainer title="Monthly Progress Report">
      {/* Start the form */}
      {loading ? <Loading />
        : errorMessage() ? <InvalidQuestionnaire error={errorMessage()} /> :
          (
            <Formik
              enableReinitialize
              initialValues={initialAnswer}
              onSubmit={async (answer, { resetForm, setSubmitting }) => {
                setSubmitting(true);
                const result = await handleSubmitAnswerSet(answer);
                if (result) {
                  toast.success("Submitted successfully, thank you");
                  resetForm();
                } else toast.error("Failed to submit, please try again");
                setSubmitting(false);
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
                        fullWidth required={required}>
                        {/* Question labels */}
                        <Typography
                          sx={{ mt: 3, fontWeight: "bold" }}
                          color="text.secondary"
                        >
                          {`${index + 1}. ${question.Question} ${required ? "*" : ""}`}
                        </Typography>
                        {/* Question input */}
                        {isMentorQuestion(question) ? <MentorNameInput question={question} />
                          : isMenteeQuestion(question) ?
                            <MenteesNameInput
                              name={question.QuestionID}
                              onChange={handleChange}
                              menteeList={mentees!}
                              defaultMentee={initialAnswer[question.QuestionID]}
                            />
                            : isChoiceQuestion(question) ? <ChoiceInput question={question} />
                              : <TextInput question={question} />}
                      </FormControl>
                    )
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
