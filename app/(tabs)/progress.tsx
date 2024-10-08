import { useColorScheme } from 'nativewind';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useContext, useEffect } from 'react';
import { AppDataContext } from '@/app/_layout';
import { BarChart } from 'react-native-gifted-charts';

export default function TabTwoScreen() {
  const { colorScheme } = useColorScheme();
  const { appData } = useContext(AppDataContext);

  let barData: { value: number; label: string }[] = appData
    ? appData.tracks.map(track => ({
        value: track.habit.currectFrequency,
        label: track.habit.name,
      }))
    : [];

  useEffect(() => {
    if (appData && appData.tracks[0]) {
      barData = appData.tracks.map(track => ({
        value: track.habit.currectFrequency,
        label: track.habit.name,
      }));
    }
  }, [appData?.tracks]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].card },
      ]}>
      <Text style={styles.title}>Completed Streaks</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <View
        style={{
          height: '80%',
          width: '80%',
          maxWidth: 768,
          backgroundColor: 'transparent',
        }}>
        <ScrollView>
          <BarChart
            barWidth={24}
            noOfSections={3}
            barBorderRadius={4}
            frontColor={Colors[colorScheme ?? 'light'].tint}
            data={barData}
            color={Colors[colorScheme ?? 'light'].tint}
            width={360}
            height={96 * (barData.length + 1)}
            xAxisLabelsHeight={24}
            spacing={48}
            rulesColor={Colors[colorScheme ?? 'light'].placeholder}
            yAxisTextStyle={{ color: Colors[colorScheme ?? 'light'].text }}
            xAxisLabelTextStyle={{ color: Colors[colorScheme ?? 'light'].text }}
            isThreeD={true}
            sideColor={'#a6a'}
            topColor={'#848'}
            animationDuration={300}
            rotateLabel={true}
            yAxisThickness={0}
            xAxisThickness={0}
            horizontal={true}
            yAxisAtTop={true}
          />
        </ScrollView>
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
});
