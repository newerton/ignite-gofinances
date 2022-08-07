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
import { useCallback, useRef, useState } from "react";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-x-helper";
import HighlightCard from "../components/HighlightCard";
import { Feather } from "@expo/vector-icons";
import {
  TransactionCard,
  TransactionCardProps,
} from "../components/TransactionCard";
import { BorderlessButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const sum = (data, type) => {
  return data.reduce((total, transaction) => {
    if (transaction.transaction_type === type) {
      return total + transaction.price;
    }
    return total;
  }, 0);
};

const lastDate = (data, type) => {
  const date = data.reduce((last, transaction) => {
    if (transaction.transaction_type === type) {
      return last > transaction.date ? last : transaction.date;
    }
    return last;
  }, 0);

  if (date) {
    return dayjs(date).format("DD [de] MMMM");
  }
  return null;
};

const firstDate = (data) => {
  const date = data.reduce((last, transaction) => {
    return last < transaction.date ? last : transaction.date;
  }, 0);

  if (date) {
    return dayjs(date).format("DD [de] MMMM");
  }
  return null;
};

export function Dashboard() {
  const [data, setData] = useState<TransactionCardProps[]>([]);

  const [income, setIncome] = useState<number | null>(null);
  const [incomeLastDate, setIncomeLastDate] = useState<string>(null);

  const [outcome, setOutcome] = useState<number| null>(null);
  const [outcomeLastDate, setOutcomeLastDate] = useState<string>(null);

  const [total, setTotal] = useState<number| null>(null);
  const [totalFirstDate, setTotalFirstDate] = useState<string>(null);

  const { colors } = useTheme();
  const statusBarHeight = getStatusBarHeight();
  const flatListRef = useRef(null);

  const loadData = async () => {
    const dataKey = "@gofinance:transactions";
    const dataStorage = await AsyncStorage.getItem(dataKey);
    const transactions = dataStorage ? JSON.parse(dataStorage) : [];

    const sumIncome = sum(transactions, "up");
    setIncome(sumIncome);
    const lastIncome = lastDate(transactions, "up");
    setIncomeLastDate(lastIncome);

    const sumOutcome = sum(transactions, "down");
    setOutcome(sumOutcome);
    const lastOutcome = lastDate(transactions, "down");
    setOutcomeLastDate(lastOutcome);

    setTotal(sumIncome - sumOutcome);
    const firstTotal = firstDate(transactions);
    setTotalFirstDate(firstTotal);

    setData(transactions.sort((a, b) => b.date.localeCompare(a.date)));
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }, [])
  );

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

          <BorderlessButton onPress={() => {}}>
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
          </BorderlessButton>
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
          amount={income}
          lastTransaction={`${
            incomeLastDate ? `Última entrada dia ${incomeLastDate}` : ""
          }`}
        />
        <HighlightCard
          type="outcome"
          title="Saídas"
          amount={outcome}
          lastTransaction={`${
            outcomeLastDate ? `Última saída dia ${outcomeLastDate}` : ""
          }`}
        />
        <HighlightCard
          type="total"
          title="Total"
          amount={total}
          lastTransaction={`${
            totalFirstDate ? `${totalFirstDate} até hoje` : ""
          }`}
        />
      </ScrollView>

      <Column flex={1} px={6} mt={20}>
        {data.length > 0 && (
          <Text fontSize={18} mb={4}>
            Listagem
          </Text>
        )}

        <FlatList
          ref={flatListRef}
          data={data}
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
