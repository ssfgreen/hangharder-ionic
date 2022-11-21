import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
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
    <div className="m-2 rounded border bg-neutral-800 p-2">
      <div className="m-1 space-y-1">
        <header className="flex flex-row items-center space-x-2">
          <h1 className="text-xl">{exercise.title}</h1>
          <span className="text-xs">by {exercise.author.name}</span>
        </header>
        <p>{exercise.summary}</p>
      </div>
      {timerAvailable && (
        <Timer
          repDuration={exercise.repDuration as number}
          reps={exercise.reps as number}
          sets={exercise.sets as number}
          repsRest={exercise.repsRest as number}
          setsRest={exercise.setsRest as number}
        ></Timer>
      )}
      <div className="flex justify-center">
        <Log id={props.id} />
      </div>
    </div>
  ) : (
    <div>Exercise {props.id} not found</div>
  );
};

export default Exercise;
