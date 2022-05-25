import { useAuth } from "../context/AuthContext";
import TitledContainer from "./shared/TitledContainer";

const Profile = () => {
  const {mentor} = useAuth();
  return <TitledContainer title="Profile">
    Name: {mentor.firstname} {mentor.surname}
  </TitledContainer>;
};

export default Profile;
