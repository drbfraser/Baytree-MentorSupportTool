import { createContext, FunctionComponent, useContext } from "react";
import { login, logout, verify } from "../api/auth";
import useLocalStorage from "../hooks/useLocalStorage";

interface UserInfo {
  userId: number;
  email: string;
}
interface AuthContextType {
  user?: UserInfo;
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
  const [user, setUser] = useLocalStorage<UserInfo>("user", undefined);

  const signIn = async (email: string, password: string) => {
    const respond = await login(email, password);
    setUser(respond ? {
      userId: +respond.user_id,
      email
    } : undefined);
    return !!respond;
  };

  const signOut = async () => {
    const loggedOut = await logout();
    if (loggedOut) {
      setUser(undefined);
    }
    return loggedOut;
  };

  const verifyClient = async () => {
    if (!user) return false;
    const verified = await verify();
    if (!verified) { 
      setUser(undefined);
    }
    return !!verified;
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, verifyClient }}
      {...props}
    />
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
