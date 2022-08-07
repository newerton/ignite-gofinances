import { Row, Text, useTheme, View } from "native-base";
import { Feather } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { InterfaceHStackProps } from "native-base/lib/typescript/components/primitives/Stack/HStack";

type MonthSelectProps = InterfaceHStackProps & {
  selectedDate: Date;
  handleChangeDate: (action: "next" | "prev") => void;
};

export function MonthSelect({
  selectedDate,
  handleChangeDate,
  ...props
}: MonthSelectProps) {
  const { colors } = useTheme();

  return (
    <Row w="full" justifyContent="space-between" alignItems="center" {...props}>
      <BorderlessButton onPress={() => handleChangeDate("prev")}>
        <Feather name="chevron-left" size={24} color={colors.gray.default} />
      </BorderlessButton>
      <Text color={colors.gray.default} fontSize={20}>
        {dayjs(selectedDate).format("MMMM, YYYY")}
      </Text>
      <BorderlessButton onPress={() => handleChangeDate("next")}>
        <Feather name="chevron-right" size={24} color={colors.gray.default} />
      </BorderlessButton>
    </Row>
  );
}
