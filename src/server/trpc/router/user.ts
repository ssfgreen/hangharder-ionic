import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const userRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.id
        },
        include: {
          authoredExercises: true,
          loggedExercises: true
        }
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  })
});
