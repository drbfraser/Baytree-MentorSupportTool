import { Button, Container, Divider, Grow, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "./LoadingScreen";
import { blankAnswers, fetchQuestions, Question, validate } from "./question";
import QuestionField from "./QuestionField";

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
            onSubmit={(answer, { resetForm }) => {
              console.log(answer);
            }}
          >
            {({ values }) => (
              <Form>
                {questions.map((question, index) => (
                  <QuestionField
                    question={question}
                    numbering={index + 1}
                    key={question.QuestionID}
                  />
                ))}
                <Button
                  disabled={!validate(questions, values)}
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
  );
};

export default Questionnaire;
