import { useEffect, useState } from "react";
import { fetchGoalStatistics } from "../api/goals";

const useGoalStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({ active: 0, complete: 0 });
  const [error, setError] = useState<string | undefined>();

  const refreshStatistics = () => {
    setLoading(true);
    fetchGoalStatistics()
      .then(({ data, error }) => {
        if (!data || error !== "") {
          setError(error);
        } else setStatistics(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshStatistics();
  }, []);

  return {
    loadingStatistics: loading,
    statistics,
    statisticsError: error,
    refreshStatistics
  };
};

export default useGoalStatistics;
