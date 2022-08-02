import { Column, IconButton, Row, Text, useTheme } from "native-base";
import {Feather} from '@expo/vector-icons'
import { BRL } from "../../utils/currency";

type HighlightCardProps = {
  title: string;
  amount: number;
  lastTransaction: string;
  type: "income" | "outcome" | "total";
};

const icon = {
  income: "arrow-up-circle",
  outcome: "arrow-down-circle",
  total: "dollar-sign",
};

export function HighlightCard({
  type,
  title,
  amount,
  lastTransaction,
}: HighlightCardProps) {
  const { colors } = useTheme();
  const iconName = icon[type] as keyof typeof Feather.glyphMap;
  const backgroundColor =
    type === "total" ? colors.secondary.default : colors.white.default;
  const currencyColor = type === "total" ? colors.white.default : "black";
  const descriptionColor =
    type === "total" ? colors.white.default : colors.gray[400];
  const iconColor =
    type === "income"
      ? colors.success.default
      : type === "outcome"
      ? colors.error.default
      : colors.white.default;

  return (
    <Column
      backgroundColor={backgroundColor}
      w={80}
      borderRadius={5}
      px={7}
      py={5}
      pb={10}
      mr={4}
    >
      <Row
        w="full"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={10}
      >
        <Text color={currencyColor}>{title}</Text>
        <Feather name={iconName} size={40} color={iconColor} />
      </Row>

      <Row>
        <Column>
          <Text fontSize={32} fontWeight={500} color={currencyColor}>
            {BRL(amount).format()}
          </Text>
          <Text fontSize={12} color={descriptionColor}>
            {lastTransaction}
          </Text>
        </Column>
      </Row>
    </Column>
  );
}
