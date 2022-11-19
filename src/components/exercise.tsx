import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Exercise: NextPage = () => {
  // const { data: exercise, isLoading } = trpc.exercise.getById.useQuery(
  //   'clao4h9kd0000ovzwxsko9gg6'
  // );

  const { data: exercises, isLoading } = trpc.exercise.getAll.useQuery();

  console.log(exercises);

  if (isLoading) return <div>Loading...</div>;

  const Exercises = exercises
    ? exercises.map((exercise, i) => {
        return (
          <div key={i} className="border p-2">
            <h1>{exercise.title}</h1>
            <p>{exercise.summary}</p>
            <p>By {exercise.author.name}</p>
          </div>
        );
      })
    : null;

  return <main>{Exercises}</main>;
};

export default Exercise;
