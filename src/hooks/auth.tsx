import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;
const { RESPONSE_TYPE } = process.env;

type AuthorizationResponse = {
  params: {
    access_token: string;
  };
  type: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthState = {
  user: User;
  access_token: string;
};

type AuthContextProps = {
  user: User;
  loading: boolean;
  signInGoogle(): Promise<void>;
  signInApple(): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, access_token] = await AsyncStorage.multiGet([
        "@gofinance:user",
        "@gofinance:access_token",
      ]);

      if (user[1] && access_token[1]) {
        setData({ user: JSON.parse(user[1]), access_token: access_token[1] });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signInGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const SCOPE = encodeURI(process.env.SCOPE);
      const QUERY = `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${QUERY}`;

      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        ).then((res) => res.json());

        const userLogged = {
          id: response.id,
          email: response.email,
          name: response.given_name,
          photo: response.picture,
        };

        await AsyncStorage.multiSet([
          ["@gofinance:user", JSON.stringify(userLogged)],
          ["@gofinance:access_token", params.access_token],
        ]);

        setData({ user: userLogged, access_token: params.access_token });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      throw new Error(err);
    }
    
  }, []);

  const signInApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        };

        await AsyncStorage.multiSet([
          ["@gofinance:user", JSON.stringify(userLogged)],
          ["@gofinance:access_token", credential.identityToken],
        ]);

        setData({ user: userLogged, access_token: credential.identityToken });
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@gofinance:user", "@gofinance:token"]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signInGoogle, signInApple, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
