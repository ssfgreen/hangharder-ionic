import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Exercise: NextPage = () => {
  // const { data: exercise, isLoading } = trpc.exercise.getById.useQuery(
  //   'clao4h9kd0000ovzwxsko9gg6'
  // );

  const { data: exercises, isLoading } = trpc.exercise.getAll.useQuery();

  console.log(exercises);

  if (isLoading) return <div>Loading...</div>;

  return <main>{exercises && exercises[0] && exercises[0].title}</main>;
};

export default Exercise;
