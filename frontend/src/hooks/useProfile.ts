import { useEffect, useState } from "react";
import { dummyUser, getMentorProfile, User } from "../api/views";

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