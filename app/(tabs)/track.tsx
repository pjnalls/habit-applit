import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useColorScheme } from 'nativewind';

import { Text, View } from '@/components/Themed';
import Colors, { STORAGE_KEY } from '@/constants/Colors';
import { AppDataJson, Track } from '@/app/types';
import { AppDataContext } from '@/app/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TabOneScreen() {
  const { colorScheme } = useColorScheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [clearDataModalVisible, setClearDataModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );
  const { appData, setAppData, setIsEditing, setEditHabitId } =
    useContext(AppDataContext);

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

  const TrackItem = ({ item }: { item: Track }) => {
    const [deleteHabitModalVisible, setDeleteHabitModalVisible] =
      useState(false);
    return (
      <View
        key={`track-${item.id}-${item.date}`}
        style={styles.trackItemContainer}>
        <Checkbox
          value={item?.habit.completed}
          color={Colors[colorScheme ?? 'light'].tint}
          onValueChange={value => {
            handleOnValueChange(value, item);
          }}
          accessibilityLabel='Completed'>
          Completed
        </Checkbox>
        <Text style={{ width: '80%' }}>{item.habit.name}</Text>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => {
              setIsEditing(true);
              setEditHabitId(item.habit.id);
              router.navigate('/');
            }}>
            <MaterialIcons
              name='edit'
              size={20}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ alignSelf: 'flex-end' }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '50%' }}
            onPress={() => {
              setDeleteHabitModalVisible(true);
            }}>
            <MaterialIcons
              name='delete'
              size={20}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ alignSelf: 'flex-end' }}
            />
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            setDeleteHabitModalVisible(!deleteHabitModalVisible);
          }}>
          <Modal
            animationType='slide'
            transparent={true}
            visible={deleteHabitModalVisible}
            onRequestClose={() => {
              setDeleteHabitModalVisible(!deleteHabitModalVisible);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  padding: 32,
                  borderRadius: 5,
                  gap: 8,
                  alignItems: 'flex-end',
                }}>
                <Text>
                  Are you sure you'd like to delete habit "{item.habit.name}"?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    gap: 8,
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      const data = await AsyncStorage.getItem(STORAGE_KEY);
                      if (data === null) {
                        setAppData(null);
                        return null;
                      }
                      const json = JSON.parse(data) as AppDataJson;
                      json.tracks.splice(
                        json.tracks.findIndex(t => t.id === item.id),
                        1,
                      );
                      await AsyncStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({
                          ...json,
                          tracks: json.tracks,
                        }),
                      );
                      setAppData(json);
                      setTracks(json.tracks);

                      setDeleteHabitModalVisible(!deleteHabitModalVisible);
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors[colorScheme ?? 'light'].success,
                        borderRadius: 4,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                      }}>
                      <Text
                        style={{
                          color: Colors[colorScheme ?? 'light'].background,
                        }}>
                        Yes
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setDeleteHabitModalVisible(!deleteHabitModalVisible);
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors[colorScheme ?? 'light'].failure,
                        borderRadius: 4,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                      }}>
                      <Text
                        style={{
                          color: Colors[colorScheme ?? 'light'].background,
                        }}>
                        No
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  useEffect(() => {
    if (appData) {
      setTracks(appData.tracks);
      setCurrentDate(
        new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      );
    } else {
      setTracks([]);
    }
  }, [appData?.tracks[0]]);

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
          {currentDate}
        </Text>
        <View
          style={{
            height: '80%',
            flexDirection: 'column',
            backgroundColor: 'transparent',
          }}>
          <FlatList
            data={tracks}
            keyExtractor={item => `${item.id}`}
            renderItem={data => <TrackItem item={data.item} />}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginBottom: 8,
          }}>
          {tracks.length <= 0 ? (
            <Text>Add a habit first to track it.</Text>
          ) : (
            <Text></Text>
          )}
        </View>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => {
            setClearDataModalVisible(true);
          }}>
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].tint,
              width: 120,
              borderRadius: 4,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
              }}>
              Clear App Data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setClearDataModalVisible(!clearDataModalVisible);
        }}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={clearDataModalVisible}
          onRequestClose={() => {
            setClearDataModalVisible(false);
          }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                margin: 20,
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                padding: 32,
                borderRadius: 5,
                gap: 8,
                alignItems: 'flex-end',
              }}>
              <Text>Are you sure you'd like to clear all app data?</Text>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'transparent',
                  gap: 8,
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    await AsyncStorage.clear();
                    const data = await AsyncStorage.getItem(STORAGE_KEY);
                    if (data === null) {
                      setAppData(null);
                      setClearDataModalVisible(false);
                      return null;
                    }
                    const json = JSON.parse(data) as AppDataJson;
                    await AsyncStorage.setItem(
                      STORAGE_KEY,
                      JSON.stringify({
                        habits: [],
                        tracks: [],
                        currentDate: new Date(),
                      }),
                    );
                    setAppData(json);
                    setTracks([]);
                    setClearDataModalVisible(false);
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors[colorScheme ?? 'light'].success,
                      borderRadius: 4,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                    }}>
                    <Text
                      style={{
                        color: Colors[colorScheme ?? 'light'].background,
                      }}>
                      Yes
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setClearDataModalVisible(false);
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors[colorScheme ?? 'light'].failure,
                      borderRadius: 4,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                    }}>
                    <Text
                      style={{
                        color: Colors[colorScheme ?? 'light'].background,
                      }}>
                      No
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
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
    width: '90%',
  },
});
