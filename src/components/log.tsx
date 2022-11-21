import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import Timer from './timer';

interface LogProps {
  id: string;
}

const Log: NextPage<LogProps> = (props) => {
  const { data: session } = useSession();
  const mutation = trpc.log.insertOne.useMutation();

  const handleLog = async () => {
    session?.user?.id &&
      mutation.mutate({
        exerciseId: props.id,
        userId: session.user.id,
        comment: 'I did it!'
      });
  };

  return (
    <div>
      <button className="m-2 rounded bg-blue-400 p-2" onClick={handleLog}>
        Log Exercise
      </button>
      {mutation.error && (
        <p className="text-red">
          Something went wrong! {mutation.error.message}
        </p>
      )}
    </div>
  );
};

export default Log;
