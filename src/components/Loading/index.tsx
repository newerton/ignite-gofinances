import { Column, useTheme } from "native-base";
import { ActivityIndicator } from "react-native";

export function Loading() {
  const { colors } = useTheme();
  return (
    <Column flex={1} justifyContent="center">
      <ActivityIndicator color={colors.primary.default} size={40} />
    </Column>
  );
}
