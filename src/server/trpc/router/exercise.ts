import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { WorkOutTypesEnum } from '@/types/prismaZod';
import type {
  ExerciseWithIncludedFields,
  ExerciseWithFavourited
} from '@/types/exercise';

const defaultExerciseSelect = Prisma.validator<Prisma.ExerciseSelect>()({
  id: true,
  title: true,
  summary: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  author: true,
  workout: true,
  favourites: true,
  duration: true,
  authorId: true,
  image: true,
  video: true
});

const minimialSelect = Prisma.validator<Prisma.ExerciseSelect>()({
  id: true,
  title: true,
  summary: true,
  createdAt: true,
  updatedAt: true,
  author: true
});

const computeExerciseWithFavourited = (
  exercise: ExerciseWithIncludedFields,
  userId: string
): ExerciseWithFavourited => {
  const favourited =
    exercise.favourites?.some((favourite) => favourite.userId === userId) ??
    false;

  return { ...exercise, favourited };
};

export const exerciseRouter = router({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const exercise = await ctx.prisma.exercise.findFirst({
      where: {
        id: input
      },
      include: {
        workout: true,
        author: true,
        favourites: true
      }
    });

    const exerciseWithFavourited =
      exercise &&
      ctx.session?.user?.id &&
      computeExerciseWithFavourited(exercise, ctx.session?.user?.id);
    return exerciseWithFavourited;
  }),
  favourite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const exerciseWithFav = await ctx.prisma.userFavouriteExercise.findFirst({
        where: {
          exerciseId: input,
          userId: ctx.session.user.id
        }
      });

      if (!exerciseWithFav) {
        const exerciseWithFav = await ctx.prisma.userFavouriteExercise.create({
          data: {
            exercise: {
              connect: {
                id: input
              }
            },
            user: {
              connect: {
                id: ctx.session.user.id
              }
            }
          }
        });
        return exerciseWithFav;
      } else {
        const deletedUserFav = await ctx.prisma.userFavouriteExercise.delete({
          where: {
            id: exerciseWithFav.id
          }
        });
        return deletedUserFav;
      }
    }),
  getIds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.exercise.findMany({
      select: {
        id: true
      },
      where: {}
    });
  }),
  getAllMinimial: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.exercise.findMany({
      select: minimialSelect,
      where: {},
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    const exercises = ctx.prisma.exercise.findMany({
      select: defaultExerciseSelect,
      where: {},
      orderBy: {
        createdAt: 'desc'
      }
    });

    const exercisesWithFavorite = exercises.then(
      (exercises): ExerciseWithFavourited[] => {
        return exercises.map((exercise) => {
          return computeExerciseWithFavourited(
            exercise,
            ctx.session?.user?.id || '' // this catches if a user is not logged in, will return all false
          );
        });
      }
    );

    return exercisesWithFavorite;
  }),
  insertOne: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        summary: z.string(),
        description: z.string(),
        workout: z.object({
          type: z.enum(WorkOutTypesEnum),
          repDuration: z.number(),
          sets: z.number(),
          reps: z.number(),
          setsRest: z.number(),
          repsRest: z.number()
        })
      })
    )
    .mutation(({ ctx, input }) => {
      const workoutWithAuthor = {
        ...input.workout,
        authorId: ctx.session.user.id
      };

      return ctx.prisma.exercise.create({
        data: {
          title: input.title,
          summary: input.summary,
          description: input.description,
          authorId: ctx.session.user.id,
          workout: {
            create: workoutWithAuthor
          }
        },
        include: {
          workout: true,
          author: true
        }
      });
    })
});
