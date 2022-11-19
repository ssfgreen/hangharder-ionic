import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { exerciseRouter } from './exercise';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  exercise: exerciseRouter,
  example: exampleRouter,
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
