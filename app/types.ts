export type AppDataJson = {
  habits: Habit[];
  track: Track[];
};

type Habit = {
  id: HabitId;
  name?: string;
  description?: string;
  frequency?: number;
  completed?: boolean;
};

type HabitId = number;

type HabitTrack = {
  id: HabitId;
  completed: boolean;
};

type Track = {
  id: number;
  date: Date;
  habit: HabitTrack;
};
