import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import Timer from './timer';

interface ExerciseProps {
  id: string;
}

const Exercise: NextPage<ExerciseProps> = (props) => {
  const { data: exercise, isLoading } = trpc.exercise.getById.useQuery(
    props.id
  );
  const { data: session } = useSession();
  const mutation = trpc.log.insertOne.useMutation();

  console.log(exercise);

  if (isLoading) return <div>Loading Exercise...</div>;

  const handleLog = async () => {
    session?.user?.id &&
      mutation.mutate({
        exerciseId: props.id,
        userId: session.user.id,
        comment: 'I did it!'
      });
  };

  return exercise ? (
    <div className="border p-2">
      <h1>{exercise.title}</h1>
      <p>{exercise.summary}</p>
      <p>By {exercise.author.name}</p>
      <button onClick={handleLog}>Log Exercise</button>
      <Timer
        repDuration={exercise.repDuration}
        reps={exercise.reps}
        sets={exercise.sets}
        repsRest={exercise.repsRest}
        setsRest={exercise.setsRest}
      ></Timer>
      {mutation.error && (
        <p className="text-red">
          Something went wrong! {mutation.error.message}
        </p>
      )}
    </div>
  ) : (
    <div>Exercise {props.id} not found</div>
  );
};

export default Exercise;
