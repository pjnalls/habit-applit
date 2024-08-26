export type AppDataJson = {
  habits: Habit[];
  tracks: Track[];
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
  name: string;
};

export type Track = {
  id: number;
  date: string;
  habit: HabitTrack;
};
