import { getDefaultState } from '@tanstack/query-core/build/lib/mutation';
import type { NextPage } from 'next';
import React from 'react';

interface TimerProps {
  repDuration: number;
  reps: number;
  sets: number;
  repsRest: number;
  setsRest: number;
}

const Timer: NextPage<TimerProps> = (props) => {
  const [currentRep, setCurrentRep] = React.useState(1);
  const [currentSet, setCurrentSet] = React.useState(1);
  const [started, setStarted] = React.useState(false);
  const [repRest, setRepRest] = React.useState(false);
  const [setRest, setSetRest] = React.useState(false);
  const [countdown, setCountdown] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  // format seconds in mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const minsFromMillis = (millis: number) => {
    const mins = Math.floor(millis / 1000 / 60);
    return mins < 10 ? `0${mins}` : mins;
  };

  const secsFromMillis = (millis: number) => {
    const secs = Math.floor(millis / 1000) % 60;
    return secs < 10 ? `0${secs}` : secs;
  };

  const millisRemaining = (millis: number) => {
    let m = millis % 1000;
    m = Math.round(m / 100);
    return m == 10 ? 0 : m;
  };

  // start timer
  const startTimer = (duration: number) => {
    console.log('called', duration);
    setTimer(duration);
    setPlaying(true);
    setRepRest(false);
  };

  // reset timer
  const resetTimer = () => {
    setTimer(0);
    setStarted(false);
    setPlaying(false);
    setCurrentRep(1);
    setCurrentSet(1);
    setRepRest(false);
    setSetRest(false);
  };

  const adjustRep = (increment: number) => {
    if (currentRep + increment <= props.reps && currentRep + increment > 0) {
      setCurrentRep(currentRep + increment);
      setTimer(0);
      setPlaying(false);
    }
    if (
      increment > 0 &&
      currentRep + increment > props.reps &&
      currentSet + increment <= props.sets
    ) {
      setCurrentRep(1);
      setCurrentSet(currentSet + increment);
    }
    if (
      increment < 0 &&
      currentRep + increment < 1 &&
      currentSet + increment > 0
    ) {
      setCurrentRep(props.reps);
      setCurrentSet(currentSet + increment);
    }
  };

  const adjustSet = (increment: number) => {
    if (currentSet + increment <= props.sets && currentSet + increment > 0) {
      setCurrentSet(currentSet + increment);
      setCurrentRep(1);
      setTimer(0);
      setPlaying(false);
    }
  };

  const getInstruction = () => {
    if (countdown || (timer <= 1000 && (repRest || setRest)))
      return 'Get Ready';
    if (!started) return 'Click Start to begin';
    if (repRest) return 'Rep Rest';
    if (setRest) return 'Set Rest';
    if (timer === 0 && currentRep === props.reps && currentSet === props.sets)
      return 'Finished!';
    if (playing && (!repRest || !setRest)) return 'Work';
    if (!playing) return 'Paused';
  };

  // handle timer
  React.useEffect(() => {
    if (started) {
      if (timer > 0) {
        const interval = setInterval(() => {
          if (playing) {
            setTimer(timer - 1);
          }
        }, 1);
        return () => clearInterval(interval);
      } else if (countdown) {
        setCountdown(false);
        setTimer(props.repDuration * 1000);
      } else if (timer === 0 && (repRest || setRest)) {
        if (repRest) {
          setRepRest(false);
          setCurrentRep(currentRep + 1);
        }
        if (setRest) {
          setSetRest(false);
          setCurrentSet(currentSet + 1);
          setCurrentRep(1);
        }
        startTimer(props.repDuration * 1000);
      } else if (timer === 0 && currentRep < props.reps && !repRest) {
        setRepRest(true);
        setTimer(props.repsRest * 1000);
      } else if (
        timer === 0 &&
        currentRep === props.reps &&
        currentSet < props.sets &&
        !setRest
      ) {
        setSetRest(true);
        setTimer(props.repsRest * 1000);
      } else if (timer === 0 && currentSet === props.sets) {
        resetTimer();
      }
    }
  }, [
    timer,
    started,
    countdown,
    playing,
    currentRep,
    currentSet,
    props.sets,
    props.reps,
    props.repDuration,
    props.repsRest,
    repRest,
    setRest
  ]);

  const handlePlayPause = () => {
    if (!started) {
      setStarted(true);
      setCountdown(true);
      setTimer(3 * 1000);
    }
    if (!playing) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  return (
    <div className="border p-2">
      <h1>Timer</h1>
      <div className="flex flex-row justify-between">
        <span>{formatTime(props.repDuration)} per rep</span>
        <span>{props.reps} reps</span>
        <span>{props.sets} sets</span>
      </div>
      <p>{formatTime(props.repsRest)} rest between reps</p>
      <p>{formatTime(props.setsRest)} rest between sets</p>
      <div className="text-xl">
        <span>
          {!started
            ? minsFromMillis(props.repDuration * 1000)
            : minsFromMillis(timer)}
        </span>
        <span>:</span>
        <span>
          {!started
            ? secsFromMillis(props.repDuration * 1000)
            : secsFromMillis(timer)}
        </span>
        <span>:</span>
        <span>{!started ? '0' : millisRemaining(timer)}</span>
        <span className="pl-2 text-xs">{getInstruction()}</span>
      </div>
      <div className="flex flex-row justify-between">
        <span>
          Rep {currentRep} / {props.reps}
        </span>
        <span>
          Set {currentSet} / {props.sets}
        </span>
      </div>
      <div className="flex flex-row justify-between">
        <button className="p-2" onClick={() => adjustSet(-1)}>
          Back Set
        </button>
        <button className="p-2" onClick={() => adjustRep(-1)}>
          Back Rep
        </button>
        <button className="p-2" onClick={() => adjustRep(1)}>
          Next Rep
        </button>
        <button className="p-2" onClick={() => adjustSet(1)}>
          Next Set
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <button className="p-2" onClick={handlePlayPause}>
          {!started ? 'Start' : playing ? 'Pause' : 'Play'}
        </button>
        <button className="p-2" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
