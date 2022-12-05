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
  likedBy: User[] | null;
};

export type LogEntryProps = {
  log: MinimalLog;
};
