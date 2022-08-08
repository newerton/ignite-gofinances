import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { Platform } from "react-native";
import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Resume } from "../screens/Resume";
import { Feather } from "@expo/vector-icons";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors } = useTheme();

  return (
    <Navigator
      initialRouteName="Listagem"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary.default,
        tabBarInactiveTintColor: colors.gray.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height: getBottomSpace() + 50,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather
              name="list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather
              name="dollar-sign"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Screen name="Resumo" component={Resume} options={{
          tabBarIcon: ({ size, color }) => (
            <Feather
              name="pie-chart"
              size={size}
              color={color}
            />
          ),
        }}/>
    </Navigator>
  );
}
