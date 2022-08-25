import { useEffect, useState } from "react";
import { getMenteesForMentor, type Participant } from "../api/views";
import { useAuth } from "../context/AuthContext";

/** Get mentees for the currently logged in mentor from backend
 * @returns
 * mentees: loaded mentees, null if mentees aren't loaded yet
 * error: null if no errors loading mentees, string with reason if an error occurred
 */
const useMentees = () => {
  const [mentees, setMentees] = useState<Participant[] | null>(null);
  const [error, setError] = useState<OnMenteesFailedToLoadReason | "">("");
  const { user } = useAuth();

  const getMenteeData = async () => {
    try {
      if (!user || !user.viewsPersonId) {
        setError("INVALID_USER");
        return;
      }

      const menteesResponse = await getMenteesForMentor();

      if (!menteesResponse.data) {
        setError("MENTEES_ENDPOINT");
        return;
      }

      setMentees(menteesResponse.data);
    } catch {
      setError("EXCEPTION");
    }
  };

  useEffect(() => {
    getMenteeData();
  }, []);

  return { mentees, error, loadingMentees: !mentees && !error };
};

export type OnMenteesFailedToLoadReason =
  | "MENTEES_ENDPOINT"
  | "INVALID_USER"
  | "EXCEPTION";

export default useMentees;
