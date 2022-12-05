import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  description: true,
  authoredExercises: {
    select: {
      id: true,
      title: true,
      description: true
    }
  },
  loggedExercises: {
    select: {
      id: true
    }
  }
});

export const userRouter = router({
  getMe: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      select: defaultUserSelect,
      where: {
        id: ctx.session?.user?.id
      }
    });
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        select: defaultUserSelect,
        where: {
          id: input.id
        }
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  })
});
