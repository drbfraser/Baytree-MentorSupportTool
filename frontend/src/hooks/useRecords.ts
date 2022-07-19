import { useEffect, useState } from "react";
import { fetchSessions, SessionRecord } from "../api/records";

const useRecords = (query: {
  page: number,
  limit: number,
  descending: boolean
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [sessions, setSessions] = useState([] as SessionRecord[]);

  useEffect(() => {
    setLoading(true);
    const { page, limit, descending } = query;
    fetchSessions({ limit, offset: page * limit, descending: descending ? 1 : 0 })
      .then(({ data, error }) => {
        if (data && !error) {
          setCount(data.count);
          setSessions(data.results);
        }
        else setError(error);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return { count, loading, sessions, error };
}

export default useRecords;