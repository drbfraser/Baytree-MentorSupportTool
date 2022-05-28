import { useEffect, useState } from "react";
import { dummyMentor, getMentorProfile, Mentor } from "../api/views";
import { useAuth } from "../context/AuthContext";

const useMentorProfile = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [mentor, setMentor] = useState<Mentor>(dummyMentor);

  useEffect(() => {
    setLoadingProfile(true);
    getMentorProfile(user?.viewsPersonId)
      .then(({ data, error }) => {
        if (data && error === "") setMentor(data);
        else setMentor(dummyMentor);
      })
      .then(() => setLoadingProfile(false))

    return () => {
      setLoadingProfile(false);
    }
  }, [user]);

  return { loadingProfile, mentor, userId: user?.userId };
};

export default useMentorProfile;