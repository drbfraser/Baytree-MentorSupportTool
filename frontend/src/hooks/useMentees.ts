import { useEffect, useState } from "react";
import { getAssociations, getParticipants, Participant } from "../api/views";
import { useAuth } from "../context/AuthContext";
import { Mentee } from "../Components/sessions/session";

/** Get mentees for the currently logged in mentor from backend
 * @returns
 * mentees: loaded mentees, null if mentees aren't loaded yet
 * isLoadingMentees: true if and only if mentees are still loading,
 * error: null if no errors loading mentees, string with reason if an error occurred
 */
const useMentees = () => {
  const [mentees, setMentees] = useState<Mentee[] | null>(null);
  const [error, setError] = useState<OnMenteesFailedToLoadReason | "">("");
  const { user } = useAuth();

  const getMenteeData = async () => {
    try {
      if (!user || !user.viewsPersonId) {
        setError("FAIL_GET_LOGGED_IN_USER");
        return;
      }
      const associations = await getAssociations(user.viewsPersonId);

      if (!associations.data) {
        setError("FAIL_LOAD_ASSOCIATIONS");
        return;
      }

      const menteeAssociations = associations.data.filter(
        (association) => association.association === "Mentee"
      );
      const menteeIds = menteeAssociations.map(
        (association) => association.masterId
      );

      const participants = await getParticipants({ ids: menteeIds });
      if (!participants.data) {
        setError("FAIL_LOAD_PARTICIPANTS");
        return;
      }

      const newMentees = menteeIds.map((id) => {
        const participant = (participants.data as Participant[]).find(
          (participant) => participant.viewsPersonId === id
        ) as Participant;

        return {
          id,
          name: `${participant.firstName} ${participant.lastName}`
        };
      });

      setMentees(newMentees);
    } catch {
      setError("FAIL_EXCEPTION");
    }
  };

  useEffect(() => {
    getMenteeData();
  }, []);

  return { mentees, error };
};

export type OnMenteesFailedToLoadReason =
  | "FAIL_LOAD_ASSOCIATIONS"
  | "FAIL_LOAD_PARTICIPANTS"
  | "FAIL_GET_LOGGED_IN_USER"
  | "FAIL_EXCEPTION";

export default useMentees;
