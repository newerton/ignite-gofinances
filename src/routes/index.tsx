import { NavigationContainer } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/auth";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {!!user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
