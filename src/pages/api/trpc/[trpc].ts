import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '../../../env/server.mjs';
import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/router/_app';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// export API handler
// export default createNextApiHandler({
//   router: appRouter,
//   createContext,
//   onError:
//     env.NODE_ENV === 'development'
//       ? ({ path, error }) => {
//           console.error(`❌ tRPC failed on ${path}: ${error}`);
//         }
//       : undefined
// });

const trpcHandler = createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined
});

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD']
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  trpcHandler(req, res);
};

export default handler;
