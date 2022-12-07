import type { User, Prisma } from '@prisma/client';

export type MinimalExercise = {
  id: string;
  title: string;
  summary: string;
  author: User;
  favourited: boolean;
};

export interface ExerciseProps {
  exercises: ExerciseWithFavourited[];
}

export type ExerciseEntryProps = {
  exercise: ExerciseWithFavourited;
};

export type ExerciseWithIncludedFields = Prisma.ExerciseGetPayload<{
  include: {
    workout: true;
    author: true;
    favourites: true;
  };
}>;

export type ExerciseWithFavourited = ExerciseWithIncludedFields & {
  favourited: boolean;
};

// ({
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     title: string;
//     summary: string;
//     description: string | null;
//     duration: number | null;
//     author: User;
//     authorId: string;
//     image: string | null;
//     video: string | null;
//     workout: Workout | null;
//     favourites: UserFavouriteExercise[];
// } | undefined
