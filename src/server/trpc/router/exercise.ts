import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';

const defaultExerciseSelect = Prisma.validator<Prisma.ExerciseSelect>()({
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
        author: true
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
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.exercise.findMany({
      select: defaultExerciseSelect,
      where: {},
      orderBy: {
        createdAt: 'desc'
      }
    });
  })
});
