import { API_BASE_URL } from "./url";

export const login = async (email: string, password: string) => {
  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/token/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    if (apiRes.status === 200) {
      return await apiRes.json();
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const logout = async () => {
  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/token/logout/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (apiRes.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const verifyFetch = async () => {
  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/token/verify/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return apiRes.status === 200;
  } catch (err) {
    return false;
  }
};

export const refreshAccessToken = async () => {
  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/token/refresh/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return apiRes;
  } catch (err) {
    return null;
  }
};

export const verify = async () => {
  try {
    if (!await verifyFetch()) {
      const res = await refreshAccessToken();
      return res && res.status === 200;
    }

    return true;
  } catch (err) {
  }
};
