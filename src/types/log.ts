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
  likedBy: User[];
};

export type LogEntryProps = {
  log: MinimalLog;
};
