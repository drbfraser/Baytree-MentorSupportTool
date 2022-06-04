import { Button, FormControl, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitAnswer } from "../../api/misc";
import useQuestionnaire, { isAutoFilled, isRequired } from "../../hooks/useQuestionnaire";
import Loading from "../shared/Loading";
import TitledContainer from "../shared/TitledContainer";
import ChoiceQuestion, { isChoiceQuestion } from "./ChoiceQuestion";
import TextQuestion from "./TextQuestion";
import InvalidQuestionnaire from "./InvalidQuestionnaire";

const Questionnaire = () => {
  const { loading, questions, initialAnswer, validateAnswer } = useQuestionnaire();
  return (
    <TitledContainer title="Monthly Progress Report">
      {/* Start the form */}
      { loading ? <Loading /> :
       (
        <Formik
          enableReinitialize
          initialValues={initialAnswer}
          onSubmit={async (answer, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { respond, error } = await submitAnswer(answer);
            if (!error && respond?.status === 200) {
              toast.success("Submitted successfullly, thank you");
              resetForm();
            } else toast.error("Failed to submit, please try again");
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              {/* Questions */}
              {questions.map((question, index) => {
                const required = isRequired(question);
                const autoFill = isAutoFilled(question);
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
                    {isChoiceQuestion(question) ? (
                      <ChoiceQuestion question={question} autoFill={autoFill} />
                    ) : (
                      <TextQuestion question={question} autoFill={autoFill} />
                    )}
                  </FormControl>
                )
              })}

              {/* Submit button */}
              <Button
                disabled={isSubmitting || !validateAnswer(values)}
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
