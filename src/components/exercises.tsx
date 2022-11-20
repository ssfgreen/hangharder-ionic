import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import Exercise from './exercise';

const Exercises: NextPage = () => {
  const { data: exerciseIds, isLoading } = trpc.exercise.getIds.useQuery();

  console.log(exerciseIds);

  if (isLoading) return <div>Loading Exercises...</div>;

  const Exercises = exerciseIds
    ? exerciseIds.map((exercise, i) => {
        return <Exercise key={i} id={exercise.id} />;
      })
    : null;

  return <main>{Exercises}</main>;
};

export default Exercises;
