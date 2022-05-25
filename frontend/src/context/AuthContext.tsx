import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { login, logout, verify } from "../api/auth";
import { dummyMentor, getMentorProfile, Mentor } from "../api/views";
import useLocalStorage from "../hooks/useLocalStorage";

interface StorageInfo {
  userId: number;
  viewsPersonId?: number;
}
interface AuthContextType {
  user?: StorageInfo;
  mentor: Mentor;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  verifyClient: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async (_email: string, _password: string) => false,
  mentor: dummyMentor,
  signOut: async () => true,
  verifyClient: async () => false
});

export const AuthProvider: FunctionComponent<{}> = (props) => {
  const [user, setUser] = useLocalStorage<StorageInfo>("user", undefined);
  const [mentor, setMentor] = useState<Mentor>(dummyMentor);

  useEffect(() => {
    getMentorProfile(user?.viewsPersonId)
    .then(({data, error}) => {
      if (data && error === "") setMentor(data);
      else setMentor(dummyMentor);
    })
  }, [user])

  const signIn = async (email: string, password: string) => {
    const {data, error} = await login(email, password);
    if (data && error === "") {
      setUser({
        userId: data.user_id,
        viewsPersonId: data.is_superuser ? undefined : data.viewsPersonId
      });
      return true;
    }
    return false;
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
      value={{ user, mentor, signIn, signOut, verifyClient }}
      {...props}
    />
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
