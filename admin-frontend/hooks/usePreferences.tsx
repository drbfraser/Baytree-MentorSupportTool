import { useEffect, useState } from "react";
import { Preference } from "../pages/preferences";

const usePreferences = () => {
    const [loadingPreferences, setLoadingPreferences] = useState(true);
    const [preferences, setPreferences] = useState([] as Preference[]);
  
    // Fetch the preferences
    useEffect(() => {
      fetchPreferences()
        .then((data) => {
          setPreferences(data.preferences);
        })
        .catch((_error) =>
          console.log("Cannot fetch the questionnaire")
        )
        .finally(() => setLoadingPreferences(false));
    }, []);
  
  
    const handleSubmitPreferences = async (preferences: Preference[]) => {
      return await submitPreferences(preferences);
    };
  
    const loading = loadingPreferences;
  
  
    return {
      loading,
      preferences,
      handleSubmitPreferences,
    };
  };

export default usePreferences;