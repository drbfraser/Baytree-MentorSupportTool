import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { recordsApi, SessionDetail } from "../api/records";

const generateMessage = (error: AxiosError, defaultMessage: string) => {
  const status = error.response?.status;
  if (status === 404)
    return "Session detail not found";
  if (status === 403)
    return "Unathorized access to session";
  else
    return defaultMessage;
};

export const useSessionDetail = (sessionId: number | string) => {
  // State for notes fields
  const queryClient = useQueryClient();
  const [sessionError, setSessionError] = useState("");

  const { data, isFetching } = useQuery<SessionDetail | undefined, AxiosError>(["sessionDetail", sessionId], async ({ signal }) => {
    const response = await recordsApi.get<SessionDetail>(`${sessionId}/`, { signal });
    return response.data;
  }, {
    onError: (error) => {
      setSessionError(generateMessage(error, "Cannot retrieve session deatil"));
    }
  });

  // Clean up the toast
  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const { mutateAsync: updateNote, isLoading: isSubmitting } = useMutation<any, AxiosError, string>((note) => recordsApi.put(`${sessionId}/notes/`, {note}), {
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries(["sessionDetail", sessionId]);
    },
    onError: (error) => {
      const message = generateMessage(error, "Cannot update session note");
      toast.error(message);
    }
  });

  return {
    session: data,
    sessionError,
    isLoading: isFetching,
    isSubmitting,
    updateNote
  };
};

export default useSessionDetail;