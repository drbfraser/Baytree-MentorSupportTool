import { useEffect, useState } from "react";
import { dummyUser, fetchMenteeProfile, getMentorProfile, User } from "../api/views";
import { useAuth } from "../context/AuthContext";

const useMentorProfile = () => {
  const { user } = useAuth();
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [loadingMentee, setLoadingMentee] = useState(false);
  const [mentor, setMentor] = useState<User>(dummyUser);
  const [mentee, setMentee] = useState<User>(dummyUser);

  // Fetch the mentor
  useEffect(() => {
    setLoadingMentor(true);
    getMentorProfile(user?.viewsPersonId)
      .then(({ data, error }) => {
        if (data && error === "") setMentor(data);
        else setMentor(dummyUser);
      })
      .then(() => setLoadingMentor(false))
  }, [user]);

  // Fetch the mentee
  useEffect(() => {
    setLoadingMentee(true);
    fetchMenteeProfile()
      .then(({ data, error }) => {
        if (data && error === "") setMentee(data);
        else setMentor(dummyUser);
      })
      .then(() => setLoadingMentee(false))
  }, [user]);

  return { loadingMentor, loadingMentee, mentor, mentee, userId: user?.userId };
};

export default useMentorProfile;