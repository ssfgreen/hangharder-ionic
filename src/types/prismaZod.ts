import { z } from 'zod';

export const ZodUser = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email()
});

export const WorkOutTypesEnum = ['TIMER', 'CLIMBER', 'REPREST'] as const;
