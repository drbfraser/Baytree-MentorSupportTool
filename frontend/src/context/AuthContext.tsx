import { createContext, FunctionComponent, useContext } from "react";
import { login, logout, verify } from "../api/auth";
import useLocalStorage from "../hooks/useLocalStorage";

interface AuthContextType {
  userId?: number;
  setUserId?: any;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  verifyClient: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async (_email: string, _password: string) => false,
  signOut: async () => true,
  verifyClient: async () => false
});

export const AuthProvider: FunctionComponent<{}> = (props) => {
  const [userId, setUserId] = useLocalStorage<number>("user_id", undefined);

  const signIn = async (email: string, password: string) => {
    const respond = await login(email, password);
    setUserId(respond ? +respond.user_id : undefined);
    console.log(respond);
    return !!respond;
  };

  const signOut = async () => {
    const res = await logout();
    res && setUserId(undefined);
    return res;
  };

  const verifyClient = async () => {
    if (!userId) return false;
    const verified = await verify();
    if (!verified) setUserId(undefined);
    return !!verified;
  };

  return (
    <AuthContext.Provider
      value={{ userId, setUserId, signIn, signOut, verifyClient }}
      {...props}
    />
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
