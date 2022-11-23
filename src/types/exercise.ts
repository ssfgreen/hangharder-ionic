import type { User } from '@prisma/client';

type MinimalExercise = {
  id: string;
  title: string;
  summary: string;
  author: User;
};

export interface ExerciseProps {
  exercises: MinimalExercise[];
}

export type ExerciseEntryProps = {
  exercise: MinimalExercise;
};
