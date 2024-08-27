import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useColorScheme } from 'nativewind';

import { Text, View } from '@/components/Themed';
import Colors, { STORAGE_KEY } from '@/constants/Colors';
import { AppDataJson, Track } from '@/app/types';
import { AppDataContext } from '@/app/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabOneScreen() {
  const { colorScheme } = useColorScheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const { appData, setAppData } = useContext(AppDataContext);

  const handleOnValueChange = async (value: boolean, item: Track) => {
    const updatedTracks = tracks.map(track =>
      track.id === item.id
        ? ({
            ...track,
            habit: {
              ...track.habit,
              completed: value,
              currectFrequency: value
                ? track.habit.currectFrequency + 1
                : track.habit.currectFrequency - 1,
            },
          } as Track)
        : (track as Track),
    );
    setTracks(updatedTracks);

    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data === null) {
      setAppData(null);
      return null;
    }
    const json = JSON.parse(data) as AppDataJson;
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...json,
        habits: json.habits,
        tracks: updatedTracks,
      }),
    );
    setAppData({
      ...json,
      habits: json.habits,
      tracks: updatedTracks,
    });
  };

  const TrackItem = (data: ListRenderItemInfo<Track>) => {
    const { item } = data;
    const track = tracks.find(t => t.id === item.id);
    return (
      <View
        key={`track-${item.id}-${item.date}`}
        style={styles.trackItemContainer}>
        <Checkbox
          value={track?.habit.completed}
          color={Colors[colorScheme ?? 'light'].tint}
          onValueChange={value => {
            handleOnValueChange(value, item);
          }}
          accessibilityLabel='Completed'>
          Completed
        </Checkbox>
        <Text style={{ width: '100%' }}>{item.habit.name}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (appData) {
      setTracks(appData.tracks);
    }
  }, [appData]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].card },
      ]}>
      <Text style={styles.title}>Track Habit</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <View
        style={{
          height: '80%',
          width: '90%',
          maxWidth: 768,
          backgroundColor: 'transparent',
        }}>
        <Text style={{ fontSize: 20, marginBottom: 16, textAlign: 'center' }}>
          {appData?.currentDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <ScrollView
          style={{
            height: 60,
            flexDirection: 'column',
          }}>
          <FlatList
            data={tracks}
            renderItem={data => <TrackItem {...data} />}
          />
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          {tracks.length <= 0 ? (
            <Text>Add a habit first to track it.</Text>
          ) : (
            <Text></Text>
          )}
        </View>
        {/* <TouchableOpacity
          style={{ backgroundColor: Colors[colorScheme ?? 'light'].tint }}
          onPress={async () => {
            await AsyncStorage.clear();
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data === null) {
              setAppData(null);
              return null;
            }
            const json = JSON.parse(data) as AppDataJson;
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                habits: json.habits,
                tracks: [],
              }),
            );
            setAppData(json);
          }}>
          <Text>Clear App Data</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  trackItemContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    gap: 8,
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
  },
});
