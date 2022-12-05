import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import type { Level } from '@prisma/client';

const defaultLogSelect = Prisma.validator<Prisma.LogSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  exercise: true,
  user: true,
  comment: true,
  likedBy: true,
  weight: true
});

interface LogInput {
  exerciseId: string;
  userId: string;
  weight?: number;
  completePerc?: number;
  comment?: string;
  level?: Level;
  dateLogged: Date;
}

const LevelEnum = ['EASY', 'MEDIUM', 'HARD'] as const;

export const logRouter = router({
  insertOne: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        dateLogged: z.date(),
        weight: z.number().optional(),
        completePerc: z.number().optional(),
        level: z.enum(LevelEnum).optional(),
        comment: z.string().optional()
      })
    )
    .mutation(({ ctx, input }) => {
      const data: LogInput = {
        exerciseId: input.exerciseId,
        userId: ctx.session.user.id,
        dateLogged: input.dateLogged
      };

      if (input.weight) {
        data['weight'] = input.weight;
      }
      if (input.completePerc) {
        data['completePerc'] = input.completePerc;
      }
      if (input.level) {
        data['level'] = input.level;
      }
      if (input.comment) {
        data['comment'] = input.comment;
      }

      const log = ctx.prisma.log.create({
        data
      });

      return log;
    }),
  likeLog: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const log = await ctx.prisma.log.findFirst({
        where: {
          id: input,
          likedBy: {
            some: {
              id: ctx.session.user.id
            }
          }
        },
        include: {
          likedBy: true
        }
      });

      if (!log) {
        const logUpdate = await ctx.prisma.log.update({
          where: {
            id: input
          },
          data: {
            likedBy: {
              connect: {
                id: ctx.session.user.id
              }
            }
          }
        });
        return logUpdate;
      } else {
        const logUpdate = await ctx.prisma.log.update({
          where: {
            id: input
          },
          data: {
            likedBy: {
              disconnect: {
                id: ctx.session.user.id
              }
            }
          }
        });
        return logUpdate;
      }
    }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.log.findFirst({
      where: {
        id: input
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),
  getMyLogs: protectedProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.log.findMany({
        where: {
          userId: input.userId
        },
        include: {
          user: true,
          exercise: true,
          likedBy: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }),
  getMyLogsByExercise: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        exerciseId: z.string()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.log.findMany({
        where: {
          userId: input.userId,
          exerciseId: input.exerciseId
        },
        include: {
          user: true,
          exercise: true
        }
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.log.findMany({
      select: defaultLogSelect,
      where: {},
      orderBy: {
        createdAt: 'desc'
      }
    });
  })
});
