import { useEffect, useState } from "react";
import { getAssociations, getParticipants, Participant } from "../api/views";
import { useAuth } from "../context/AuthContext";
import { Mentee } from "../Components/sessions/session";

/** Get mentees for the currently logged in mentor from backend
 * @param onMenteesLoaded Handler called when mentees are loaded
 * @param onMenteesFailedToLoad Handler called when mentees failed to load
 * @returns
 * mentees: loaded mentees, isLoadingMentees: true if and only if mentees are still loading
 */
const useMentees = (params?: {
  onMenteesLoaded?: (mentees: Mentee[]) => void;
  onMenteesFailedToLoad?: (reason: OnMenteesFailedToLoadReason) => void;
}) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoadingMentees, setIsLoadingMentees] = useState(true);
  const { user } = useAuth();

  const onMenteesFailedToLoad =
    params && params.onMenteesFailedToLoad
      ? params.onMenteesFailedToLoad
      : null;
  const onMenteesLoaded =
    params && params.onMenteesLoaded ? params.onMenteesLoaded : null;

  const getMenteeData = async () => {
    try {
      if (!user || !user.viewsPersonId) {
        if (onMenteesFailedToLoad) {
          onMenteesFailedToLoad("FAIL_GET_LOGGED_IN_USER");
        }
        return;
      }
      const associations = await getAssociations(user.viewsPersonId);

      if (!associations.data) {
        if (onMenteesFailedToLoad) {
          onMenteesFailedToLoad("FAIL_LOAD_ASSOCIATIONS");
        }
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
        if (onMenteesFailedToLoad) {
          onMenteesFailedToLoad("FAIL_LOAD_PARTICIPANTS");
        }
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

      if (onMenteesLoaded) {
        onMenteesLoaded(newMentees);
      }

      setIsLoadingMentees(false);
    } catch {
      if (onMenteesFailedToLoad) {
        onMenteesFailedToLoad("FAIL_EXCEPTION");
      }
    }
  };

  useEffect(() => {
    getMenteeData();
  }, []);

  return { mentees, isLoadingMentees };
};

export type OnMenteesFailedToLoadReason =
  | "FAIL_LOAD_ASSOCIATIONS"
  | "FAIL_LOAD_PARTICIPANTS"
  | "FAIL_GET_LOGGED_IN_USER"
  | "FAIL_EXCEPTION";

export default useMentees;
