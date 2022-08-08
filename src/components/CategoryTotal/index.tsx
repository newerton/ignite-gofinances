import { Box, Row, Text, useTheme } from "native-base";
import { BRL } from "../../utils/currency";
import { Feather } from "@expo/vector-icons";

type CategoryTotal = {
  key: string;
  name: string;
  icon: any;
  color: string;
  total: number;
};

type CategoryTotalProps = {
  data: CategoryTotal;
};

export function CategoryTotal({
  data: { name, color, icon, total },
}: CategoryTotalProps) {
  const { colors } = useTheme();
  return (
    <Row
      h={12}
      bg={colors.white.default}
      borderRadius={5}
      alignItems="center"
      mb={2}
      overflow="hidden"
    >
      <Row w={1} h="full">
        <Box bgColor={color} w={1} h="full" />
      </Row>
      <Row flex={1} justifyContent="space-between" px={5}>
        <Row alignItems="center">
          <Feather name={icon} size={18} color={color} />
          <Text ml={2}>{name}</Text>
        </Row>
        <Box>
          <Text fontWeight={700}>{BRL(total).format()}</Text>
        </Box>
      </Row>
    </Row>
  );
}
