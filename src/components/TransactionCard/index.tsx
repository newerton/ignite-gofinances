import dayjs from "dayjs";
import { Column, Row, Text, useTheme, View } from "native-base";
import { BRL } from "../../utils/currency";

import { Feather } from "@expo/vector-icons";
import { categories } from "../../utils/categories";

export type TransactionCardProps = {
  id: string;
  name: string;
  category: string;
  transaction_type: "up" | "down";
  price: number;
  date: string;
};

type Props = {
  data: TransactionCardProps;
};

export function TransactionCard({ data }: Props) {
  const { colors } = useTheme();
  const priceColor =
    data.transaction_type === "up"
      ? colors.success.default
      : colors.error.default;
  const currency = data.transaction_type === "up" ? data.price : -data.price;
  const category = categories.find((item: any) => item.key === data.category);

  return (
    <Column bg={colors.white.default} borderRadius={5} px={6} py={4} mb={4}>
      <Text mb={1}>{data.name}</Text>
      <Text mb={4} color={priceColor} fontSize={20}>
        {BRL(currency).format()}
      </Text>
      <Row justifyContent="space-between">
        <Row alignItems="center">
          <View mr={2}>
            <Feather name={category.icon as any} size={20} color={colors.gray.text} />
          </View>
          <Text color={colors.gray.text}>{category.name}</Text>
        </Row>
        <Text color={colors.gray.text}>
          {dayjs(data.date).format("DD/MM/YYYY")}
        </Text>
      </Row>
    </Column>
  );
}
