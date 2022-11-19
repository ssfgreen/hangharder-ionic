import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const podcastRouter = router({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        id: input,
      }
    });
  }),
});