import { Button, Container, Divider, Grow, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "./LoadingScreen";
import {
  blankAnswers,
  fetchQuestions,
  Question,
  submitAnswer,
  validate
} from "./question";
import QuestionField from "./QuestionField";
import "react-toastify/dist/ReactToastify.css";

const Questionnaire = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([] as Question[]);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoading(false))
      .catch((error) => console.log("Error: ", error));
  }, []);

  return (
    <>
      <Grow in>
        <Container maxWidth="md" sx={{ boxShadow: 5, borderRadius: 5, p: 2 }}>
          {/* Title */}
          <Typography
            component="h2"
            variant="h6"
            color="text.secondary"
            gutterBottom
          >
            Monthly Progress Report
          </Typography>
          <Divider />

          {/* Start the form */}
          {loading ? (
            <LoadingScreen />
          ) : (
            <Formik
              initialValues={blankAnswers(questions, userId)}
              onSubmit={async (answer, { resetForm, setSubmitting }) => {
                setSubmitting(true);
                const { respond, error } = await submitAnswer(answer);
                if (!error && respond?.status === 200) {
                  toast.success("Submitted successfullly, thank you");
                  resetForm(blankAnswers(questions, userId));
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
        </Container>
      </Grow>
      <ToastContainer />
    </>
  );
};

export default Questionnaire;
