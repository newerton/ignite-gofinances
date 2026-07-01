import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Image, LogBox, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import splashImage from './src/assets/images/splash.png';
import AppProvider from './src/hooks';
import { useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';
import { THEME } from './src/styles/theme';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const cacheImages = async (images) => {
  return images.map((image) => {
    if (typeof image === 'string') {
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
  }, [isAppReady, animation]);

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
              width: '100%',
              height: '100%',
              resizeMode: Constants.manifest.splash.resizeMode || 'contain',
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
        Feather: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
      });

      const isValid = !loading;

      if (isValid) {
        setSplashReady(true);
      }
    }

    prepare();
  }, [loading]);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}
