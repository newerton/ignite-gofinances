import {
  Avatar,
  Row,
  IconButton,
  Text,
  useTheme,
  Column,
  ScrollView,
  FlatList,
  Center,
} from "native-base";
import { useState } from "react";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-x-helper";
import { HighlightCard } from "../components/HighlightCard";
import { Feather } from "@expo/vector-icons";
import {
  TransactionCard,
  TransactionCardProps,
} from "../components/TransactionCard";

export function Dashboard() {
  const { colors } = useTheme();
  const statusBarHeight = getStatusBarHeight();

  const [transactions, setTransactions] = useState<TransactionCardProps[]>([
    {
      id: "e25a8fb3-e6af-4b99-b0da-8c97b3c7a03f",
      type: "income",
      title: "Desenvolvimento de site",
      amount: 1200,
      category: {
        title: "Vendas",
        icon: "dollar-sign",
      },
      date: "2022-08-01",
    },
    {
      id: "b09cc969-8c34-4365-8e13-5f80defe657d",
      type: "outcome",
      title: "Hamburgueria Pizzy",
      amount: 59,
      category: {
        title: "Alimentação",
        icon: "coffee",
      },
      date: "2022-08-01",
    },
    {
      id: "e25a8fb3-e6af-4b99-b0da-8c97b3c7a03g",
      type: "income",
      title: "Desenvolvimento de site",
      amount: 1200,
      category: {
        title: "Vendas",
        icon: "dollar-sign",
      },
      date: "2022-08-01",
    },
    {
      id: "b09cc969-8c34-4365-8e13-5f80defe657e",
      type: "outcome",
      title: "Hamburgueria Pizzy",
      amount: 59,
      category: {
        title: "Alimentação",
        icon: "coffee",
      },
      date: "2022-08-01",
    },
  ]);

  return (
    <Column flex={1} backgroundColor={colors.white.background}>
      <Row
        w="full"
        backgroundColor={colors.primary.default}
        alignItems="flex-start"
        px={6}
        pt={statusBarHeight + 28}
        h={286}
      >
        <Row w="full" justifyContent="space-between" alignItems="center">
          <Row alignItems="center">
            <Avatar
              source={{
                uri: "https://avatars.githubusercontent.com/u/4175945?v=4",
              }}
              mr={4}
              w={12}
              h={12}
            >
              NA
            </Avatar>
            <Column>
              <Text color={colors.white.default} fontSize={18} mb={-2}>
                Olá,
              </Text>
              <Text
                color={colors.white.default}
                fontSize={18}
                fontWeight="bold"
              >
                Newerton
              </Text>
            </Column>
          </Row>

          <IconButton
            p={0}
            icon={
              <Feather
                name="power"
                size={24}
                color={colors.secondary.default}
              />
            }
          />
        </Row>
      </Row>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
        position="absolute"
        mt={32}
      >
        <HighlightCard
          type="income"
          title="Entradas"
          amount={17400}
          lastTransaction="Última entrada dia 01 de agosto"
        />
        <HighlightCard
          type="outcome"
          title="Saídas"
          amount={1259}
          lastTransaction="Última saída dia 01 de agosto"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount={16141}
          lastTransaction="01 de agosto até hoje"
        />
      </ScrollView>

      <Column flex={1} px={6} mt={20}>
        {transactions.length > 0 && (
          <Text fontSize={18} mb={4}>
            Listagem
          </Text>
        )}

        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionCard data={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: getBottomSpace(),
            flexGrow: 1,
          }}
          ListEmptyComponent={() => (
            <Center flex={1}>
              <Text
                color={colors.gray.default}
                fontSize="xl"
                textAlign="center"
              >
                Você ainda não possui transação cadastrada
              </Text>
            </Center>
          )}
        />
      </Column>
    </Column>
  );
}
