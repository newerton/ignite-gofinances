import dayjs from "dayjs";
import { Column, Row, Text, useTheme, View } from "native-base";
import { BRL } from "../../utils/currency";

import { Feather } from "@expo/vector-icons";

export type TransactionCardProps = {
  id: string;
  title: string;
  category: {
    title: string;
    icon: keyof typeof Feather.glyphMap;
  };
  type: "income" | "outcome";
  amount: number;
  date: string;
};

type Props = {
  data: TransactionCardProps;
};

export function TransactionCard({ data }: Props) {
  const { colors } = useTheme();
  const amountColor =
    data.type === "income" ? colors.success.default : colors.error.default;
  const currency = data.type === "income" ? data.amount : -data.amount;

  return (
    <Column bg={colors.white.default} borderRadius={5} px={6} py={4} mb={4}>
      <Text mb={1}>{data.title}</Text>
      <Text mb={4} color={amountColor} fontSize={20}>
        {BRL(currency).format()}
      </Text>
      <Row justifyContent="space-between">
        <Row alignItems="center">
          <View mr={2}>
            <Feather name={data.category.icon} size={20} color={colors.gray.text} />
          </View>
          <Text color={colors.gray.text}>{data.category.title}</Text>
        </Row>
        <Text color={colors.gray.text}>
          {dayjs(data.date).format("DD/MM/YYYY")}
        </Text>
      </Row>
    </Column>
  );
}
