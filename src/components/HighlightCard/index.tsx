import { Column, Row, Text, useTheme } from "native-base";
import { Feather } from "@expo/vector-icons";
import { BRL } from "../../utils/currency";
import ContentLoader, { Rect } from "react-content-loader/native";
import { memo } from "react";

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

const TotalLoader = () => (
  <ContentLoader
    speed={2}
    width={265}
    height={70}
    viewBox="0 0 265 70"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: "100%" }}
  >
    <Rect x="0" y="0" rx="4" ry="4" width="265" height="43" />
    <Rect x="0" y="55" rx="4" ry="4" width="265" height="15" />
  </ContentLoader>
);

const HighlightCard = ({
  type,
  title,
  amount,
  lastTransaction,
}: HighlightCardProps) => {
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
          {typeof amount === "number" ? (
            <>
              <Text fontSize={32} fontWeight={500} color={currencyColor}>
                {BRL(amount).format()}
              </Text>
              <Text fontSize={12} color={descriptionColor}>
                {lastTransaction}
              </Text>
            </>
          ) : (
            <TotalLoader />
          )}
        </Column>
      </Row>
    </Column>
  );
};

export default memo(HighlightCard);
