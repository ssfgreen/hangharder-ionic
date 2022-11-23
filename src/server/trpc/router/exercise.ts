import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';

const defaultExerciseSelect = Prisma.validator<Prisma.ExerciseSelect>()({
  id: true,
  title: true,
  summary: true,
  createdAt: true,
  updatedAt: true,
  author: true
});

const minimialSelect = Prisma.validator<Prisma.ExerciseSelect>()({
  id: true,
  title: true,
  summary: true,
  createdAt: true,
  updatedAt: true,
  author: true
});

export const exerciseRouter = router({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        id: input
      },
      include: {
        author: true,
        workouts: true
      }
    });
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
    return ctx.prisma.exercise.findMany({
      select: defaultExerciseSelect,
      where: {},
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),
  insertOne: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        summary: z.string(),
        authorId: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.exercise.create({
        data: {
          title: input.title,
          summary: input.summary,
          authorId: input.authorId
        }
      });
    })
});
