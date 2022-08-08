import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { Box, Column, Heading, ScrollView, useTheme } from "native-base";
import { useCallback, useState } from "react";
import { VictoryPie } from "victory-native";
import { CategoryTotal } from "../components/CategoryTotal";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { MonthSelect } from "../components/MonthSelect";
import { TransactionCardProps } from "../components/TransactionCard";
import { useAuth } from "../hooks/auth";
import { categories } from "../utils/categories";

export function Resume() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    const dataKey = `@gofinance:transactions:${user.id}`;
    const dataStorage = await AsyncStorage.getItem(dataKey);
    const transactions = dataStorage ? JSON.parse(dataStorage) : [];

    const data = categories
      .map((category) => {
        const transactionsByCategory = transactions.filter(
          (transaction: TransactionCardProps) =>
            transaction.category === category.key &&
            dayjs(transaction.date).format("MM-YYYY") ===
              dayjs(selectedDate).format("MM-YYYY")
        );

        const total = transactionsByCategory.reduce(
          (total, transaction) => total + transaction.price,
          0
        );

        return {
          ...category,
          total,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const addPercentage = data.map((category) => {
      const total = data.reduce((total, category) => total + category.total, 0);
      const percentage = `${((category.total / total) * 100).toFixed(0)}%`;
      return {
        ...category,
        percentage,
      };
    });
    const onlyWithTotal = addPercentage.filter(
      (category) => category.total > 0
    );

    setCategoriesList(onlyWithTotal);
    setIsLoading(false);
  };

  const handleChangeDate = (action: "next" | "prev") => {
    setIsLoading(true);
    if (action === "next") {
      setSelectedDate(dayjs(selectedDate).add(1, "month").toDate());
    } else {
      setSelectedDate(dayjs(selectedDate).subtract(1, "month").toDate());
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Column flex={1}>
      <Header title="Resumo por categoria" />
      <MonthSelect
        selectedDate={selectedDate}
        handleChangeDate={handleChangeDate}
        py={4}
        px={6}
        mt={4}
      />
      <ScrollView
        flex={1}
        pt={2}
        px={6}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: useBottomTabBarHeight(),
          justifyContent: "center",
          height: isLoading || categoriesList.length === 0 ? "100%" : "auto",
        }}
      >
        {isLoading ? (
          <Loading />
        ) : categoriesList.length > 0 ? (
          <>
            <Box alignItems="center" mt={-5}>
              <VictoryPie
                height={350}
                colorScale={categoriesList.map((category) => category.color)}
                data={categoriesList}
                x="percentage"
                y="total"
                style={{
                  labels: {
                    fontSize: 18,
                    fontWeight: "bold",
                    fill: colors.white.default,
                  },
                }}
                labelRadius={50}
              />
            </Box>

            {categoriesList.map((category) => (
              <CategoryTotal key={category.key} data={category} />
            ))}
          </>
        ) : (
          <Heading textAlign="center" size="md">
            Nenhum resultado encontrado para esse mês.
          </Heading>
        )}
      </ScrollView>
    </Column>
  );
}
