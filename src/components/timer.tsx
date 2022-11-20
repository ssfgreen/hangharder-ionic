import type { NextPage } from 'next';

interface TimerProps {
  repDuration: number;
  reps: number;
  sets: number;
  repsRest: number;
  setsRest: number;
}

const Timer: NextPage<TimerProps> = (props) => {
  return (
    <div className="border p-2">
      <h1>Timer</h1>
    </div>
  );
};

export default Timer;
