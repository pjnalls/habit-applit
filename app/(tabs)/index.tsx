import { useContext, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { Text, View } from '@/components/Themed';
import Colors, { STORAGE_KEY } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataJson } from '../types';
import { AppDataContext } from '../_layout';

export default function TabOneScreen() {
  const { colorScheme } = useColorScheme();
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { setAppData } = useContext(AppDataContext);

  const validateText = (name: string) => {
    const alphaNumericRegex = /^[A-Za-z0-9 ]+$/;
    return alphaNumericRegex.test(name);
  };
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
        json = { habits: [], tracks: [] };
      } else {
        json = JSON.parse(appData);
      }

      const habit = {
        id: json.habits.length,
        name: habitName,
        description: habitDesc,
        frequency: 0,
      };
      json?.habits.push(habit);
      json?.tracks.push({
        id: json.tracks.length,
        date: new Date().toLocaleString(),
        habit: { id: habit.id, name: habit.name, completed: false },
      });

      setAppData(json);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(json));

      setHabitName('');
      setHabitDesc('');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error saving data.');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].card },
      ]}>
      <Text style={styles.title}>Add Habit</Text>
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
    height: 12,
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
    height: 12,
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
