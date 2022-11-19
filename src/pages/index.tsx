import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Exercise from '../components/exercise';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      {session ? (
        <div>
          <p>hi {session.user?.name}</p>
          <button onClick={() => signOut()}>Logout</button>
          <Exercise />
        </div>
      ) : (
        <div>
          <h1>Hello There</h1>
          <button onClick={() => signIn('discord')}>Login with Discord</button>
        </div>
      )}
    </main>
  );
};

export default Home;
