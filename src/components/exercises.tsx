import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import Exercise from './exercise';

const Exercises: NextPage = () => {
  const { data: exercises, isLoading } = trpc.exercise.getAll.useQuery();

  console.log(exercises);

  if (isLoading) return <div>Loading...</div>;

  const Exercises = exercises
    ? exercises.map((exercise, i) => {
        return (
          <Exercise
            key={i}
            exId={exercise.id}
            title={exercise.title}
            summary={exercise.summary}
            author={exercise.author && exercise.author.name}
          />
        );
      })
    : null;

  return <main>{Exercises}</main>;
};

export default Exercises;
