import { Box, Text, useTheme } from "native-base";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

type SignInSocialButtonProps = RectButtonProps & {
  title: string;
  svg: React.FC<SvgProps>;
};
export function SignInSocialButton({
  title,
  svg: Svg,
  ...props
}: SignInSocialButtonProps) {
  const { colors } = useTheme();

  return (
    <RectButton
      style={{
        flexDirection: "row",
        backgroundColor: colors.white.default,
        borderRadius: 5,
        marginBottom: 16,
        elevation: 2,
      }}
      {...props}
    >
      <Box borderRightWidth={0.4} borderRightColor={colors.gray.text} p={4}>
        <Svg />
      </Box>
      <Box w="full" flex={1} justifyContent="center" alignItems="center">
        <Text fontFamily="mono" fontSize={16}>
          {title}
        </Text>
      </Box>
    </RectButton>
  );
}
