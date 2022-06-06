import { useEffect, useState } from "react";
import { dummyUser, getMentorProfile, User } from "../api/views";

const useMentor = () => {
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [mentor, setMentor] = useState<User>(dummyUser);
  const [error, setError] = useState("");

  // Fetch the mentor
  useEffect(() => {
    setLoadingMentor(true);
    getMentorProfile()
      .then(({ data, error: mentorError }) => {
        if (data && !mentorError) setMentor(data);
        else setError(mentorError);
      })
      .finally(() => setLoadingMentor(false));
  }, []);

  return { loadingMentor, mentor, error };
};

export default useMentor;