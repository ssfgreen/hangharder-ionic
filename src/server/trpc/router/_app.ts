import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { exerciseRouter } from './exercise';

export const appRouter = router({
  exercise: exerciseRouter,
  example: exampleRouter,
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
