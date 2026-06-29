import { useRoutes } from "@/hooks/useRouter";
import { apiPrivate } from "@/services/api/api";
import { get, save } from "@/services/store";
import { Response, Tokens, User, UserData } from "@/types/authorization";
import { createContext, useContext, useEffect, useState } from "react";

interface ProviderProps {
  user: User;
  profile: UserData;
  tokens: Tokens;
  isLogged: boolean;
  isLoaded: boolean;
  login(response: Response): void;
  reg_fstage(response: Response): void;
  reg_sstage(data: User): void;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  user: {
    id: "",
    nickname: "",
    email: "",
  },
  profile: {
    profile_picture: "",
    age: "",
    description: "",
  },
  tokens: {
    access_token: "",
    refresh_token: "",
  },
  isLogged: false,
  isLoaded: false,
  login: () => {},
  reg_fstage: () => {},
  reg_sstage: () => {},
  logout: () => {},
});

const cleanUser = {
  id: "",
  nickname: "",
  email: "",
};

const cleanUserData = {
  profile_picture: "",
  age: "",
  description: "",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { navigateAuthorization, navigateAccountSetup } = useRoutes();

  const [user, setUser] = useState<User>(cleanUser);
  const [profile, setProfile] = useState<UserData>(cleanUserData);
  const [tokens, setTokens] = useState<Tokens>({
    access_token: get("access_token") || "",
    refresh_token: get("refresh_token") || "",
  });

  const [isLogged, setIsLogged] = useState<boolean>(
    tokens.access_token !== "" ? true : false,
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getProfile = async () => {
    const { data } = await apiPrivate.get("/profile/");
    console.log(data.result)
    if (data?.result) {
      setProfile(data.result);
    }
  };

  const refresh = async () => {
    try {
      const response: Response = await apiPrivate.get("/auth/reauth");
      if (response.access !== "") {
        await login(response);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (tokens.refresh_token !== "") {
      (async () => {
        try {
          await refresh();
        } catch {
          logout();
          setIsLoaded(true);
        } finally {
          setIsLoaded(true);
        }
      })();
    }
  }, []);

  const saveToken = async (
    token: string,
    type: "access_token" | "refresh_token",
  ) => {
    save(type, token);
    setTokens((prev) => ({ ...prev, [type]: token }));
  };

  const saveTokens = async (access: string, refresh: string) => {
    await saveToken(access, "access_token");
    await saveToken(refresh, "refresh_token");
  };

  const login = async (response: Response) => {
    setUser(response.user);
    await saveTokens(response.access, response.refresh);
    await getProfile();
    setIsLogged(true);
    setIsLoaded(true);
  };

  const reg_fstage = async (response: Response) => {
    await saveTokens(response.access, response.refresh);
    setUser(response.user);
    setIsLoaded(true);
    navigateAccountSetup();
    
  };

  const reg_sstage = async () => {
    await getProfile();
    setIsLogged(true);
    setIsLoaded(true);
  };

  const logout = async () => {
    setUser(cleanUser);
    setProfile(cleanUserData);
    await saveTokens("", "");
    setIsLogged(false);
    navigateAuthorization();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        tokens,
        isLogged,
        isLoaded,
        login,
        logout,
        reg_fstage,
        reg_sstage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
