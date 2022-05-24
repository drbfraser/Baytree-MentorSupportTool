import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import TitledContainer from "../shared/TitledContainer";
import LoadingScreen from "./LoadingScreen";
import {
  blankAnswers,
  fetchQuestions,
  Question,
  submitAnswer,
  validate
} from "./question";
import QuestionField from "./QuestionField";

const Questionnaire = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([] as Question[]);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoading(false))
      .catch((error) => console.log("Error: ", error));
  }, []);

  return (
    <TitledContainer title="Monthly Progress Report">
      {/* Start the form */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <Formik
          initialValues={blankAnswers(questions, user!.userId)}
          onSubmit={async (answer, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            const { respond, error } = await submitAnswer(answer);
            if (!error && respond?.status === 200) {
              toast.success("Submitted successfullly, thank you");
              resetForm(blankAnswers(questions, user!.userId));
            } else toast.error("Failed to submit, please try again");
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              {questions.map((question, index) => (
                <QuestionField
                  question={question}
                  numbering={index + 1}
                  key={question.QuestionID}
                />
              ))}
              <Button
                disabled={isSubmitting || !validate(questions, values)}
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
