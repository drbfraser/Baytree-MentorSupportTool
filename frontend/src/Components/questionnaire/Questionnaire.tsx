import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Answer, fetchQuestions, Question, submitAnswer } from "../../api/misc";
import { useAuth } from "../../context/AuthContext";
import Loading from "../shared/Loading";
import TitledContainer from "../shared/TitledContainer";
import QuestionField from "./QuestionField";

// Validate answer based on the questionnaire requirements
const validate = (questions: Question[], answer: Answer) => {
  return questions
    .filter((q) => q.enabled === "1" && q.validation.includes("required"))
    .every((q) => (answer[q.QuestionID] || "") !== "");
};

// Generate the blankAnswers based on the questionnaire format
const blankAnswers = (questions: Question[], mentorId?: number) => {
  let blank = questions
    .map((q) => q.QuestionID)
    .reduce((acc, id) => {
      acc[id] = "";
      return acc;
    }, {} as Answer);
  if (mentorId) blank["mentorId"] = `${mentorId}`;
  return blank;
};

const Questionnaire = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([] as Question[]);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoading(false))
      .catch((error) => console.error("Error: ", error));
  }, []);

  return (
    <TitledContainer title="Monthly Progress Report">
      {/* Start the form */}
      {loading ? (
        <Loading />
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
              {/* Questions */}
              {questions.map((question, index) => (
                <QuestionField
                  question={question}
                  numbering={index + 1}
                  key={question.QuestionID}
                />
              ))}

              {/* SAubmit button */}
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
