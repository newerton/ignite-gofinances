import {
  Box,
  Column,
  FormControl,
  Row,
  Text,
  useTheme,
  WarningOutlineIcon,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { FieldError } from "react-hook-form";
import { RectButton } from "react-native-gesture-handler";

type TransactionTypeButtonProps = {
  transactionType: "up" | "down";
  setTransactionType: Dispatch<SetStateAction<"up" | "down" | null>>;
  error: FieldError;
};

const TransactionTypeButton = ({
  transactionType,
  setTransactionType,
  error,
}: TransactionTypeButtonProps) => {
  const { colors } = useTheme();

  return (
    <FormControl isInvalid={Boolean(error && error.message)} mb={4}>
      <Row w="full" alignItems={"center"} justifyContent="center" space={2}>
        <Column w="49%">
          <RectButton onPress={() => setTransactionType("up")}>
            <Box
              bg={
                transactionType === "up"
                  ? colors.success.light
                  : colors.white.background
              }
              borderWidth={1}
              borderColor={
                transactionType === "up"
                  ? colors.success.light
                  : colors.gray.text
              }
              borderRadius={4}
              p={3}
              alignItems="center"
            >
              <Row>
                <Feather
                  name="arrow-up-circle"
                  size={24}
                  color={colors.success.default}
                />
                <Text ml={2} color={colors.gray.default}>
                  Income
                </Text>
              </Row>
            </Box>
          </RectButton>
        </Column>
        <Column w="49%">
          <RectButton onPress={() => setTransactionType("down")}>
            <Box
              bg={
                transactionType === "down"
                  ? colors.error.light
                  : colors.white.background
              }
              borderWidth={1}
              borderColor={
                transactionType === "down"
                  ? colors.error.light
                  : colors.gray.text
              }
              borderRadius={4}
              p={3}
              alignItems="center"
            >
              <Row>
                <Feather
                  name="arrow-down-circle"
                  size={24}
                  color={colors.error.default}
                />
                <Text ml={2} color={colors.gray.default}>
                  Outcome
                </Text>
              </Row>
            </Box>
          </RectButton>
        </Column>
      </Row>
      {error && (
        <FormControl.ErrorMessage
          px={2}
          leftIcon={<WarningOutlineIcon size="xs" />}
          _text={{ color: "red.400" }}
        >
          {error.message}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default TransactionTypeButton;
