import { NativeBaseProvider, StatusBar, View } from "native-base";
import { THEME } from "./src/styles/theme";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { Routes } from "./src/routes";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { Animated, Image, StyleSheet } from "react-native";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import splashImage from "./src/assets/images/splash.png";
import { SignIn } from "./src/screens/SignIn";
import AppProvider from "./src/hooks";

import { LogBox } from "react-native";
import { useAuth } from "./src/hooks/auth";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const cacheImages = async (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const cacheFonts = async (fonts) => {
  return Font.loadAsync(fonts);
};

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <NativeBaseProvider theme={THEME}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppProvider>
            <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
              <Routes />
            </AnimatedAppLoader>
          </AppProvider>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    </>
  );
}

function AnimatedSplashScreen({ children, image }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      console.log(e);
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest.splash.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={splashImage}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

function AnimatedAppLoader({ children, image }) {
  const [isSplashReady, setSplashReady] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    async function prepare() {
      await cacheImages([splashImage]);

      await cacheFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Feather: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf"),
      });

      const isValid = !loading;

      if (isValid) {
        setSplashReady(true);
      }
    }

    prepare();
  }, [image, loading]);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}
