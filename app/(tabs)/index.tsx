import { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { Text, View } from '@/components/Themed';
import Colors, { STORAGE_KEY } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataJson, Habit, Track } from '@/app/types';
import { AppDataContext } from '@/app/_layout';
import { router } from 'expo-router';

export default function TabOneScreen() {
  const { colorScheme } = useColorScheme();
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { appData, setAppData, isEditing, setIsEditing, editHabitId } =
    useContext(AppDataContext);

  const validateText = (name: string) => {
    const regex = /^[a-zA-Z0-9\s.,!?-]+$/;
    return regex.test(name);
  };
  const nameRef = useRef<TextInput>(null);
  const descRef = useRef<TextInput>(null);

  const handleOnChangeText = (
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    setTextError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setText(text);
    if (!validateText(text)) {
      setTextError('Invalid value for text field');
    } else {
      setTextError(null);
    }
  };
  const handleOnPress = async () => {
    try {
      const appData = await AsyncStorage.getItem(STORAGE_KEY);
      let json: AppDataJson;

      if (appData === null) {
        json = { habits: [], tracks: [], currentDate: new Date() };
      } else {
        json = JSON.parse(appData);
      }

      if (isEditing) {
        const tracks = json.tracks.map(t => {
          if (t.id === editHabitId) {
            return {
              ...t,
              habit: { ...t.habit, name: habitName, description: habitDesc },
            };
          } else {
            return { ...t };
          }
        }) as Track[];
        json.habits = tracks.map(t => t.habit);
        json.tracks = tracks;
      } else {
        const id = uuidv4();
        const habit: Habit = {
          id,
          name: habitName,
          description: habitDesc,
          currectFrequency: 0,
          previousFrequency: 0,
          completed: false,
        };
        json?.habits.push(habit);
        json?.tracks.push({
          id,
          date: new Date(),
          habit,
        });
      }

      setAppData(json);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(json));

      setHabitName('');
      setHabitDesc('');
      (nameRef.current as TextInputProps).value = '';
      (descRef.current as TextInputProps).value = '';
      setIsSuccess(true);
      if (isEditing) {
        setIsEditing(false);
        router.navigate('/(tabs)/track');
      }
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      const habit = appData?.tracks.find(track => track.id == editHabitId)
        ?.habit as Habit;
      setHabitName(habit.name);
      setHabitDesc(habit.description);
      (nameRef.current as TextInputProps).value = habit.name;
      (descRef.current as TextInputProps).value = habit.description;
    } else {
      setHabitName('');
      setHabitDesc('');
    }
  }, [isEditing]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].card },
      ]}>
      <Text style={styles.title}>{isEditing ? 'Edit' : 'Add'} Habit</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <View style={styles.inputContainer}>
        {isSuccess ? (
          <View style={styles.successContainer}>
            <MaterialIcons
              size={24}
              name='check'
              color={Colors[colorScheme ?? 'light'].success}
            />
            <Text style={{ color: Colors[colorScheme ?? 'light'].success }}>
              Habit created successfully
            </Text>
          </View>
        ) : (
          <View style={styles.successContainer}></View>
        )}
        <View style={styles.innerInputContainer}>
          <Text>Name</Text>
          <TextInput
            ref={nameRef}
            style={[
              styles.textInput,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder='Enter habit name here'
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
            onChangeText={text => {
              handleOnChangeText(text, setHabitName, setNameError);
            }}
            maxLength={64}
          />
          {nameError ? (
            <Text style={styles.textInputError}>{nameError}</Text>
          ) : (
            <Text style={styles.textInputError}></Text>
          )}
        </View>
        <View style={styles.innerInputContainer}>
          <Text>Description</Text>
          <TextInput
            ref={descRef}
            style={[
              styles.textInput,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].inputBackground,
                color: Colors[colorScheme ?? 'light'].text,
              },
            ]}
            placeholder='Enter habit description here'
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
            onChangeText={text => {
              handleOnChangeText(text, setHabitDesc, setDescError);
            }}
            maxLength={480}
          />
          {descError ? (
            <Text style={styles.textInputError}>{descError}</Text>
          ) : (
            <Text style={styles.textInputError}></Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          disabled={!habitName || !habitDesc}
          onPress={handleOnPress}>
          <MaterialIcons
            size={36}
            name='add-circle'
            color={
              !habitName || !habitDesc
                ? Colors[colorScheme ?? 'light'].placeholder
                : Colors[colorScheme ?? 'light'].text
            }
          />
          <Text
            style={{
              color:
                !habitName || !habitDesc
                  ? Colors[colorScheme ?? 'light'].placeholder
                  : Colors[colorScheme ?? 'light'].text,
            }}>
            Create Habit
          </Text>
        </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'column',
    gap: 4,
    width: '70%',
    maxWidth: 768,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  innerInputContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'transparent',
  },
  textInput: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginVertical: 4,
  },
  textInputError: {
    color: '#f00',
    textAlign: 'center',
    height: 16,
  },
  submitButton: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    gap: 4,
    height: 16,
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
});
