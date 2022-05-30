import useMentorProfile from "../hooks/useProfile";
import Loading from "./shared/Loading";
import TitledContainer from "./shared/TitledContainer";

const Profile = () => {
  const { loadingMentor, mentor } = useMentorProfile();
  return !loadingMentor ? <TitledContainer title="Profile">
    Name: {mentor.firstname} {mentor.surname}
  </TitledContainer> : <Loading />;
};

export default Profile;
