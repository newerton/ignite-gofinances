import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Box,
  FormControl,
  IInputProps,
  Input,
  useTheme,
  WarningOutlineIcon,
} from "native-base";
import { FieldError } from "react-hook-form";

type TextFieldProps = IInputProps & {
  error?: FieldError;
  loading?: boolean;
};

const TextField = ({ error, onChange, ...rest }: TextFieldProps, ref: any) => {
  const inputRef = useRef(null);
  const { colors } = useTheme();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return (
    <Box flex={rest.flex} mb={5} w="full">
      <FormControl flex={rest.flex} isInvalid={Boolean(error && error.message)}>
        <Input
          bg={colors.white.default}
          borderColor={colors.white.default}
          size="md"
          fontSize="md"
          fontFamily="body"
          color={colors.gray.text}
          placeholderTextColor="gray.300"
          _focus={{
            borderWidth: 1,
            borderColor: "green.500",
            bg: colors.white.default,
          }}
          ref={inputRef}
          {...rest}
        />
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
    </Box>
  );
};

export default forwardRef(TextField);
