import { MutableRefObject, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAssociations,
  getParticipants,
  Participant
} from "../../../api/views";
import { useAuth } from "../../../context/AuthContext";
import { Mentee } from "../session";

const useMentees = (
  setFieldValueRef: MutableRefObject<
    | ((
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
      ) => void)
    | undefined
  >
) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [isLoadingMentees, setIsLoadingMentees] = useState(true);
  const { user } = useAuth();
  const FAILURE_MESSAGE = "Failed to retrieve mentee data.";

  const getMenteeData = async () => {
    try {
      if (user && user.viewsPersonId) {
        const associations = await getAssociations(user.viewsPersonId);

        if (!associations.data) {
          toast.error(FAILURE_MESSAGE);
        } else {
          const menteeAssociations = associations.data.filter(
            (association) => association.association === "Mentee"
          );
          const menteeIds = menteeAssociations.map(
            (association) => association.masterId
          );

          const participants = await getParticipants({ ids: menteeIds });
          if (!participants.data) {
            toast.error(FAILURE_MESSAGE);
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

          if (newMentees.length > 0 && setFieldValueRef.current) {
            setFieldValueRef.current(
              "menteeViewsPersonId",
              newMentees[0].id,
              true
            );
          }

          setIsLoadingMentees(false);
        }
      } else {
        toast.error(FAILURE_MESSAGE);
      }
    } catch {
      toast.error(FAILURE_MESSAGE);
    }
  };

  useEffect(() => {
    getMenteeData();
  }, []);

  return { mentees, isLoadingMentees };
};

export default useMentees;
