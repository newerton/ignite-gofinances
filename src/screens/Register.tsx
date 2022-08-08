import { Column, Text, useTheme } from "native-base";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ControlledTextField from "../components/ControlledTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import TransactionTypeButton from "../components/TransactionTypeButton";
import { SelectField } from "../components/SelectField";
import { CategorySelect } from "./CategorySelect";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import uuid from "react-native-uuid";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/auth";

const initialValues = {
  name: "",
  price: "",
  transaction_type: null,
  category: "",
};

type RegisterFormData = {
  name: string;
  price: string;
  transaction_type: "up" | "down";
  category: string;
};

const OrderRegisterSchema = Yup.object({
  name: Yup.string().required("Nome é obrigatório").label("Nome"),
  price: Yup.number()
    .typeError("Preço é obrrigatório")
    .positive("O preço não pode ser negativo")
    .label("Preço"),
  transaction_type: Yup.mixed()
    .oneOf(["up", "down"], "Tipo de transação é obrigatório")
    .label("Tipo de transação"),
  category: Yup.string().required("Categoria é obrigatória").label("Categoria"),
});

export function Register() {
  const { colors } = useTheme();
  const priceRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const [transactionType, setTransactionType] = useState<"up" | "down" | null>(
    null
  );
  const [category, setCategory] = useState("");
  const [categoryModalOpen, setCategorModalOpen] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(OrderRegisterSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (transactionType) {
      setValue("transaction_type", transactionType);
    }
  }, [transactionType]);

  useEffect(() => {
    if (category) {
      setValue("category", category);
    }
  }, [category]);

  const handleRegister = async (data: RegisterFormData) => {
      try {
      const dataKey = `@gofinance:transactions:${user.id}`;
      const dataStorage = await AsyncStorage.getItem(dataKey);
      const currentData = dataStorage ? JSON.parse(dataStorage) : [];
      const newTransaction = {
        ...data,
        id: uuid.v4(),
        date: new Date(),
      };

      await AsyncStorage.setItem(
        dataKey,
        JSON.stringify([...currentData, newTransaction])
      );
      reset();
      setTransactionType(null);
      setCategory("");

      Alert.alert("Transação salva com sucesso");
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  };

  const handleCloseSelectCategoryModal = () => {
    setCategorModalOpen(false);
  };

  const handleOpenSelectCategoryModal = () => {
    setCategorModalOpen(true);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Column w="full" flex={1} bg={colors.white.background}>
          <Header title="Cadastro" />

          <Column flex={1} p={6}>
            <Column flex={1}>
              <Column>
                <ControlledTextField
                  name="name"
                  control={control}
                  placeholder="Nome"
                  returnKeyType="next"
                  onSubmitEditing={() => priceRef?.current?.focus()}
                  blurOnSubmit={false}
                  error={errors.name}
                  placeholderTextColor={colors.gray.text}
                  autoCapitalize="sentences"
                  autoCorrect={false}
                />

                <ControlledTextField
                  name="price"
                  control={control}
                  placeholder="Preço"
                  ref={priceRef}
                  error={errors.price}
                  placeholderTextColor={colors.gray.text}
                  keyboardType="numeric"
                />
              </Column>

              <Column>
                <TransactionTypeButton
                  transactionType={transactionType}
                  setTransactionType={setTransactionType}
                  error={errors.transaction_type}
                />
              </Column>

              <Column>
                <SelectField
                  title={category}
                  onPress={handleOpenSelectCategoryModal}
                  error={errors.category}
                />
              </Column>
            </Column>

            <Column>
              <RectButton
                onPress={handleSubmit(handleRegister) as any}
                style={{
                  backgroundColor: colors.secondary.default,
                  borderRadius: 5,
                  height: 56,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text color={colors.white.default}>Cadastrar</Text>
              </RectButton>
            </Column>
          </Column>
        </Column>
      </TouchableWithoutFeedback>
      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </>
  );
}
