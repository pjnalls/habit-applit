import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from 'nativewind';
import { AppDataJson } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

export const AppDataContext = createContext<{
  appData: AppDataJson | null;
  setAppData: React.Dispatch<React.SetStateAction<AppDataJson | null>>;
}>({
  appData: {
    habits: [],
    tracks: [],
  },
  setAppData: () => {},
});

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();
  const [appData, setAppData] = useState<AppDataJson | null>({
    habits: [],
    tracks: [],
  });

  useEffect(() => {
    const getInitAppData = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data === null) {
        return null;
      }
      setAppData(JSON.parse(data));
    };

    getInitAppData();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppDataContext.Provider value={{ appData, setAppData }}>
        <Stack>
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='modal'
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </AppDataContext.Provider>
    </ThemeProvider>
  );
}
