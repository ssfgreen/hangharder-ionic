import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';

interface ExerciseProps {
  title: string;
  summary: string;
  author: string | null;
  exId: string;
}

const Exercise: NextPage<ExerciseProps> = (props) => {
  const { data: session, status } = useSession();

  console.log('exercise session', session);
  console.log('props', props);
  const mutation = trpc.log.insertOne.useMutation();

  const handleLog = async () => {
    session?.user?.id &&
      mutation.mutate({
        exerciseId: props.exId,
        userId: session.user.id,
        comment: 'I did it!'
      });
  };

  return (
    <div className="border p-2">
      <h1>{props.title}</h1>
      <p>{props.summary}</p>
      <p>By {props.author}</p>
      <button onClick={handleLog}>Log Exercise</button>
      {mutation.error && (
        <p className="text-red">
          Something went wrong! {mutation.error.message}
        </p>
      )}
    </div>
  );
};

export default Exercise;
