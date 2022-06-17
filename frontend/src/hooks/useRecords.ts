import { useEffect, useState } from "react";
import { fetchSessions, SessionRecord } from "../api/records";

export const PAGNINATE_OPTIONS = [5, 10, 20];

const useRecords = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paginate, setPaginate] = useState({
    count: 0,
    page: 0,
    limit: PAGNINATE_OPTIONS[0]
  });
  const [sessions, setSessions] = useState([] as SessionRecord[]);

  useEffect(() => {
    setLoading(true);
    const { page, limit } = paginate;
    fetchSessions({ limit, offset: page * limit })
      .then(({ data, error }) => {
        if (data && !error) {
          setSessions(data.results);
          setPaginate((prev) => ({ ...prev, count: data.count }))
        }
        else setError(error);
      })
      .finally(() => setLoading(false));
  }, [paginate.limit, paginate.page]);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPaginate((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginate((prev) => ({
      count: prev.count,
      page: 0,
      limit: +event.target.value
    }))
  };

  return {
    loading,
    paginate,
    sessions,
    error,
    handleChangePage,
    handleChangeRowsPerPage
  };
}

export default useRecords;