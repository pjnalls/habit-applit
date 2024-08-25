import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { Text, View } from '@/components/Themed';
import Colors, { STORAGE_KEY } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataJson } from '../types';

export default function TabOneScreen() {
  const { colorScheme } = useColorScheme();
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const validateText = (name: string) => {
    const alphaNumericRegex = /^[A-Za-z0-9]+$/;
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
      let json: AppDataJson | null = null;

      if (appData === null) {
        json = {} as AppDataJson;
      } else {
        json = JSON.parse(appData);
      }
      json?.habits.push({
        id: json.habits.length,
        name: habitName,
        description: habitDesc,
        frequency: 0,
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(json));
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
            placeholderTextColor={
              Colors[colorScheme ?? 'light'].placeholderColor
            }
            onChangeText={text => {
              handleOnChangeText(text, setHabitName, setNameError);
            }}
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
            placeholderTextColor={
              Colors[colorScheme ?? 'light'].placeholderColor
            }
            onChangeText={text => {
              handleOnChangeText(text, setHabitDesc, setDescError);
            }}
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
                ? Colors[colorScheme ?? 'light'].placeholderColor
                : Colors[colorScheme ?? 'light'].text
            }
          />
          <Text
            style={{
              color:
                !habitName || !habitDesc
                  ? Colors[colorScheme ?? 'light'].placeholderColor
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
