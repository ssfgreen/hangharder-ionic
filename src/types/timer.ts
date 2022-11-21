import type { TimerActiveStatus, TimerState } from '../constants/timer';

export interface TimerPropTypes {
  repDuration: number;
  reps: number;
  sets: number;
  repsRest: number;
  setsRest: number;
}

export interface StateTypes {
  currentRep: number;
  currentSet: number;
  timer: number;
  activeStatus: TimerActiveStatus;
  timerState: TimerState;
  reps: number;
  sets: number;
  repDuration: number;
  countdown: number;
}

export interface ActionTypes {
  type: string;
  timer?: number;
  activeStatus?: TimerActiveStatus;
  timerState?: TimerState;
  currentRep?: number;
  currentSet?: number;
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  reps?: number;
  sets?: number;
}
