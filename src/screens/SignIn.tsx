import { Box, Column, Text, useTheme } from "native-base";
import { SignInSocialButton } from "../components/SignInSocialButton";
import { useAuth } from "../hooks/auth";
import { Alert, Platform } from "react-native";

import Logo from "../assets/images/logo.svg";
import GoogleIcon from "../assets/images/google.svg";
import AppleIcon from "../assets/images/apple.svg";

export function SignIn() {
  const { colors } = useTheme();
  const { signInGoogle, signInApple } = useAuth();

  const handleSignInWithGoogle = async () => {
    try {
      return signInGoogle();
    } catch (error) {
      Alert.alert("Não foi possível conectar com a conta Google");
    }
  };

  const handleSignInWithApple = async () => {
    try {
      return signInApple();
    } catch (error) {
      Alert.alert("Não foi possível conectar com a conta Apple");
    }
  };

  return (
    <Column flex={1}>
      <Box
        w="full"
        bg={colors.primary.default}
        height="70%"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Logo />

        <Text
          fontWeight={500}
          fontSize="30"
          textAlign="center"
          color={colors.white.default}
          px="43px"
          mt={12}
          mb={20}
        >
          Controle suas finanças de forma muito simples
        </Text>
        <Text
          fontSize="16"
          textAlign="center"
          color={colors.white.default}
          px="110px"
          mb={16}
        >
          Faça seu login com uma das contas abaixo
        </Text>
      </Box>

      <Box flex={1} h="30%" bg={colors.secondary.default} px={8}>
        <Column mt={-7}>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleIcon}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleIcon}
              onPress={handleSignInWithApple}
            />
          )}
        </Column>
      </Box>
    </Column>
  );
}
