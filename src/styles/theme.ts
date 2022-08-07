import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    primary: {
      default: "#5636D3",
    },
    secondary: {
      default: "#FF872C",
      light: "rgba(255, 135, 44, 0.3)",
    },
    success: {
      default: "#12A454",
      light: "rgba(18, 164, 84, 0.5)",
    },
    error: {
      default: "#E83F5B",
      light: "rgba(232, 63, 91, 0.5)",
    },
    gray: {
      default: "#363F5F",
      text: "#969CB2",
    },
    white: {
      default: "#FFFFFF",
      background: "#F0F2F5",
    },
  },
  fontConfig: {
    Roboto: {
      400: {
        normal: "Roboto_400Regular",
      },
      500: {
        normal: "Roboto_500Medium",
      },
      700: {
        normal: "Roboto_700Bold",
      },
    },
  },
  fonts: {
    heading: "Roboto_400Regular",
    body: "Roboto_400Regular",
    mono: "Roboto_500Medium",
  },
});

type CustomThemeType = typeof THEME;

declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}
