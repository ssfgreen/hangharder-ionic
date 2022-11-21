export enum TimerActiveStatus {
  COUNTDOWN = 'countdown',
  WORK = 'work',
  REST = 'rest',
  DONE = 'done',
  INACTIVE = 'inactive'
}

export enum TimerState {
  PAUSED = 'paused',
  UNSTARTED = 'unstarted',
  PLAYING = 'playing',
  DONE = 'done'
}

export enum TimerActions {
  START = 'START',
  UPDATE = 'UPDATE',
  FINISH = 'FINISH',
  TICK = 'TICK',
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
  RESET = 'RESET',
  NEXT_REP = 'NEXT_REP',
  NEXT_SET = 'NEXT_SET',
  PREV_SET = 'PREV_SET',
  PREV_REP = 'PREV_REP'
}
