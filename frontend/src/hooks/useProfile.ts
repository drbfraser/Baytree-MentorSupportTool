import { useEffect, useState } from "react";
import { dummyUser, fetchMenteeProfile, getMentorProfile, User } from "../api/views";
import { useAuth } from "../context/AuthContext";

const useMentorProfile = () => {
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [mentor, setMentor] = useState<User>(dummyUser);

  // Fetch the mentor
  useEffect(() => {
    setLoadingMentor(true);
    getMentorProfile()
      .then(({ data, error }) => {
        if (data && error === "") setMentor(data);
        else setMentor(dummyUser);
      })
      .then(() => setLoadingMentor(false))
  }, []);

  return { loadingMentor, mentor };
};

export default useMentorProfile;