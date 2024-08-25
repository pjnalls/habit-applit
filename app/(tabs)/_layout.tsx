import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from 'nativewind';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome
      size={props.size ?? 24}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name='track'
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name='list'
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable onPress={toggleColorScheme}>
              {({ pressed }) => (
                <FontAwesome
                  name={colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name='index'
        initialParams={{ showAddHabitModal: true }}
        options={{
          title: '',
          headerTitle: 'Create',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              size={40}
              name='plus-circle'
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable onPress={toggleColorScheme}>
              {({ pressed }) => (
                <FontAwesome
                  name={colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name='bar-chart'
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable onPress={toggleColorScheme}>
              {({ pressed }) => (
                <FontAwesome
                  name={colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
