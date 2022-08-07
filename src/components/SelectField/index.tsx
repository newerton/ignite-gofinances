import {
  FormControl,
  Row,
  Text,
  useTheme,
  WarningOutlineIcon,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { categories } from "../../utils/categories";

type SelectFieldProps = {
  title: string;
  onPress: () => void;
  error: any;
};

export function SelectField({ title, onPress, error }: SelectFieldProps) {
  const { colors } = useTheme();
  const name = categories.find((item) => item.key === title)?.name;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <FormControl isInvalid={Boolean(error && error.message)} mb={4}>
        <Row
          w="full"
          alignItems={"center"}
          justifyContent="space-between"
          bg={colors.white.default}
          p={3}
          borderRadius={4}
        >
          <Text color={colors.gray.text}>{name || "Categoria"}</Text>
          <Feather name="chevron-down" size={24} color={colors.gray.text} />
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
    </TouchableOpacity>
  );
}
