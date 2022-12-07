import type { Exercise, User } from '@prisma/client';

export enum Level {
  EASY,
  MEDIUM,
  HARD
}

type MinimalLog = {
  id: string;
  comment: string | null;
  createdAt: Date;
  exercise: Exercise;
  user: User;
  weight: number | null;
  likedBy: User[] | { id: string }[] | null;
};

export type LogEntryProps = {
  log: MinimalLog;
};

export type LogEntryWithMutationProps = {
  log: MinimalLog;
  mutation: {
    mutate: (data: string) => void;
  };
};
