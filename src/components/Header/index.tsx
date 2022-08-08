import { Column, Heading, useTheme } from "native-base";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { colors } = useTheme();
  return (
    <Column
      w="full"
      alignItems="center"
      justifyContent={"flex-end"}
      pb={19}
      h={getStatusBarHeight() + 113}
      bg={colors.primary.default}
    >
      <Heading color={colors.white.default} fontWeight="normal">
        {title}
      </Heading>
    </Column>
  );
}
