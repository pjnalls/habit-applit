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
import { AppDataJson, HabitId } from './types';
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
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editHabitId: HabitId;
  setEditHabitId: React.Dispatch<React.SetStateAction<HabitId>>;
}>({
  appData: {
    habits: [],
    tracks: [],
    currentDate: new Date(),
  },
  setAppData: () => {},
  isEditing: false,
  setIsEditing: () => {},
  editHabitId: 0,
  setEditHabitId: () => {},
});

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();
  const [appData, setAppData] = useState<AppDataJson | null>({
    habits: [],
    tracks: [],
    currentDate: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editHabitId, setEditHabitId] = useState<HabitId>(0);

  useEffect(() => {
    const getInitAppData = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data === null) {
        return null;
      }
      let json: AppDataJson = JSON.parse(data);
      json.currentDate = new Date(json.currentDate);

      if (!json.currentDate) {
        json.currentDate = new Date();
      } else if (
        json.currentDate.getFullYear() - new Date().getFullYear() !== 0 &&
        json.currentDate.getMonth() - new Date().getMonth() !== 0 &&
        json.currentDate.getDate() - new Date().getDate() !== 0
      ) {
        json.currentDate = new Date();
        json.tracks = json.tracks.map(track => {
          if (track.habit.currectFrequency <= track.habit.previousFrequency) {
            track.habit.currectFrequency = track.habit.previousFrequency = 0;
          } else {
            track.habit.previousFrequency = track.habit.currectFrequency;
          }
          return { ...track, habit: { ...track.habit, completed: false } };
        });
      }

      setAppData(json);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(json));
    };

    getInitAppData();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppDataContext.Provider
        value={{
          appData,
          setAppData,
          isEditing,
          setIsEditing,
          editHabitId,
          setEditHabitId,
        }}>
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
