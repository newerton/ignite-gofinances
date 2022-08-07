import {
  Box,
  Button,
  Column,
  FlatList,
  Heading,
  Row,
  Spacer,
  Text,
  useTheme,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { categories } from "../utils/categories";
import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";

type CategorySelectProps = {
  category: string;
  setCategory: (category: string) => void;
  closeSelectCategory: Dispatch<SetStateAction<boolean>>;
};

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory,
}: CategorySelectProps) {
  const { colors } = useTheme();

  const handleCloseModal = () => {
    closeSelectCategory(false);
  };

  const handleCategorySelect = (item: string) => {
    setCategory(item);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Column w="full" flex={1} bg={colors.white.background}>
        <Column
          w="full"
          alignItems="center"
          justifyContent={"flex-end"}
          pb={19}
          h={113}
          bg={colors.primary.default}
        >
          <Heading color={colors.white.default} fontWeight={400}>
            Categorias
          </Heading>
        </Column>

        <Column flex={1}>
          <FlatList
            data={categories}
            flex={1}
            w="full"
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategorySelect(item.key)}>
                <Row
                  px={6}
                  py={3}
                  flex={1}
                  w="full"
                  alignItems="center"
                  bg={category === item.key ? colors.secondary.light : null}
                >
                  <Feather name={item.icon as any} size={16} />
                  <Text ml={2}>{item.name}</Text>
                </Row>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <Spacer borderTopWidth={1} borderColor={colors.gray[300]} />
            )}
          />

          <Column w="full" p={4}>
            <RectButton
              onPress={handleCloseModal}
              style={{
                backgroundColor: colors.secondary.default,
                borderRadius: 5,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text color={colors.white.default}>Selecionar</Text>
            </RectButton>
          </Column>
        </Column>
      </Column>
    </GestureHandlerRootView>
  );
}
