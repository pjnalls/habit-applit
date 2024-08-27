export type AppDataJson = {
  habits: Habit[];
  tracks: Track[];
  currentDate: Date;
};

export type Habit = {
  id: HabitId;
  name: string;
  description: string;
  currectFrequency: number;
  previousFrequency: number;
  completed: boolean;
};

type HabitId = number;

export type Track = {
  id: number;
  date: Date;
  habit: Habit;
};
