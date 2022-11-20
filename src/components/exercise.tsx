import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import Timer from './timer';
import Log from './log';

interface ExerciseProps {
  id: string;
}

const Exercise: NextPage<ExerciseProps> = (props) => {
  const { data: exercise, isLoading } = trpc.exercise.getById.useQuery(
    props.id
  );

  if (isLoading) return <div>Loading Exercise...</div>;

  const timerKeys = ['repDuration', 'reps', 'sets', 'repsRest', 'setsRest'];
  const timerAvailable =
    exercise && timerKeys.every((key) => exercise[key] !== null);

  return exercise ? (
    <div className="border p-2">
      <h1>{exercise.title}</h1>
      <p>{exercise.summary}</p>
      <p>By {exercise.author.name}</p>
      <Log id={props.id} />
      {timerAvailable && (
        <Timer
          repDuration={exercise.repDuration as number}
          reps={exercise.reps as number}
          sets={exercise.sets as number}
          repsRest={exercise.repsRest as number}
          setsRest={exercise.setsRest as number}
        ></Timer>
      )}
    </div>
  ) : (
    <div>Exercise {props.id} not found</div>
  );
};

export default Exercise;
