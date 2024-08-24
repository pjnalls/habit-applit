import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'nativewind';

export default function TabOneScreen({
  showAddHabitModal,
}: {
  showAddHabitModal: boolean;
}) {
  const navigation = useNavigation();
  const currentRoute =
    navigation.getState().routes[navigation.getState().index];
  const { colorScheme } = useColorScheme();
  const [isVisible, setIsVisible] = useState(false);

  const onClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.replace('/tracker');
    }, 1000);
  };

  useEffect(() => {
    setIsVisible(showAddHabitModal);
  }, [currentRoute]);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: Colors[colorScheme ?? 'light'].card },
          ]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Add New Habit</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons
                name='close'
                color={Colors[colorScheme ?? 'light'].text}
                size={22}
              />
            </Pressable>
          </View>
          <Text>This is a test.</Text>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
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
  modalContent: {
    height: Dimensions.get('window').height - 160,
    width: Dimensions.get('window').width - 48,
    left: 24,
    top: 88,
    borderRadius: 12,
    position: 'absolute',
    padding: 20,
  },
  titleContainer: {
    backgroundColor: 'transparent',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
});
