import type { NextPage } from 'next';
import React, { useReducer, useEffect } from 'react';
import {
  play,
  pause,
  refresh,
  playBack,
  playForward,
  playSkipBack,
  playSkipForward,
  close
} from 'ionicons/icons';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import {
  formatTime,
  minsFromDs,
  secsFromDs,
  decisRemaining
} from '@/utils/timer';
import { TimerActiveStatus, TimerState, TimerActions } from '@/constants/timer';
import type { TimerPropTypes, StateTypes, ActionTypes } from '@/types/timer';

const init = (initialProps: StateTypes): StateTypes => {
  return {
    currentRep: initialProps.currentRep,
    currentSet: initialProps.currentSet,
    timer: initialProps.timer,
    activeStatus: initialProps.activeStatus,
    timerState: initialProps.timerState,
    reps: initialProps.reps,
    sets: initialProps.sets,
    repDuration: initialProps.repDuration,
    countdown: initialProps.countdown
  };
};

const reducer = (state: StateTypes, action: ActionTypes): StateTypes => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        activeStatus: TimerActiveStatus.COUNTDOWN,
        timerState: TimerState.PLAYING,
        timer: state.countdown
      };
    case 'UPDATE':
      return {
        ...state,
        timer: action.timer as number,
        activeStatus: action.activeStatus as TimerActiveStatus,
        currentRep: action.currentRep || state.currentRep,
        currentSet: action.currentSet || state.currentSet
      };
    case 'FINISH':
      return {
        ...state,
        activeStatus: TimerActiveStatus.DONE,
        timerState: TimerState.DONE
      };
    case 'TICK':
      return {
        ...state,
        timer: state.timer - 1
      };
    case 'PAUSE':
      return {
        ...state,
        timerState: TimerState.PAUSED
      };
    case 'RESUME':
      if (state.activeStatus === TimerActiveStatus.COUNTDOWN) {
        return {
          ...state,
          timer: state.countdown,
          timerState: TimerState.PLAYING
        };
      } else {
        return {
          ...state,
          timerState: TimerState.PLAYING
        };
      }
    case 'PREV_SET':
      if (state.currentSet > 1) {
        return {
          ...state,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED,
          currentSet: state.currentSet - 1,
          currentRep: 1
        };
      } else {
        return state;
      }
    case 'NEXT_SET':
      if (state.currentSet < state.sets) {
        return {
          ...state,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED,
          currentSet: state.currentSet + 1,
          currentRep: 1
        };
      } else {
        return {
          ...state,
          activeStatus: TimerActiveStatus.DONE,
          timerState: TimerState.DONE,
          timer: 0,
          currentRep: state.reps,
          currentSet: state.sets
        };
      }
    case 'PREV_REP':
      if (state.currentRep > 1) {
        return {
          ...state,
          currentRep: state.currentRep - 1,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED
        };
      } else if (state.currentSet > 1) {
        return {
          ...state,
          currentRep: state.reps,
          currentSet: state.currentSet - 1,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED
        };
      } else {
        return state;
      }
    case 'NEXT_REP':
      if (state.currentRep < state.reps) {
        return {
          ...state,
          currentRep: state.currentRep + 1,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED
        };
      } else if (state.currentSet < state.sets) {
        return {
          ...state,
          currentRep: 1,
          currentSet: state.currentSet + 1,
          timer: state.repDuration,
          activeStatus: TimerActiveStatus.COUNTDOWN,
          timerState: TimerState.PAUSED
        };
      } else {
        return {
          ...state,
          activeStatus: TimerActiveStatus.DONE,
          timerState: TimerState.DONE,
          timer: 0
        };
      }
    case 'RESET':
      return init(action.payload);
    default:
      throw new Error();
  }
};

const renderInstruction = (
  activeStatus: TimerActiveStatus,
  timerState: TimerState
): string => {
  if (timerState === TimerState.PLAYING) {
    switch (activeStatus) {
      case TimerActiveStatus.COUNTDOWN:
        return 'Get Ready';
      case TimerActiveStatus.REST:
        return 'Rest';
      case TimerActiveStatus.WORK:
        return 'Go!';
      case TimerActiveStatus.DONE:
        return 'Done';
      default:
        return '';
    }
  } else if (timerState === TimerState.PAUSED) {
    return 'Paused';
  } else {
    return 'Play to Start';
  }
};

const getColour = (
  activeStatus: TimerActiveStatus,
  timerState: TimerState
): string => {
  if (timerState === TimerState.PLAYING) {
    switch (activeStatus) {
      case TimerActiveStatus.COUNTDOWN:
        return 'text-orange-400';
      case TimerActiveStatus.REST:
        return 'text-blue-400';
      case TimerActiveStatus.WORK:
        return 'text-green-400';
      case TimerActiveStatus.DONE:
        return 'text-blue-500';
      default:
        return '';
    }
  } else if (timerState === TimerState.PAUSED) {
    return 'text-red-400';
  } else {
    return 'text-primary';
  }
};

const TimerModal: NextPage<TimerPropTypes> = (props) => {
  const initialProps = {
    currentRep: 1,
    currentSet: 1,
    timer: 0,
    activeStatus: TimerActiveStatus.INACTIVE,
    timerState: TimerState.UNSTARTED,
    reps: props.reps,
    sets: props.sets,
    repDuration: props.repDuration * 10,
    countdown: 50
  };

  const [state, dispatch] = useReducer(reducer, initialProps, init);

  const handlePlayPause = () => {
    if (state.timerState === TimerState.UNSTARTED) {
      dispatch({ type: TimerActions.START });
    } else if (state.timerState === TimerState.PLAYING) {
      dispatch({ type: TimerActions.PAUSE });
    } else if (state.timerState === TimerState.PAUSED) {
      dispatch({ type: TimerActions.RESUME });
    }
  };

  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        if (state.timerState === TimerState.PLAYING) {
          dispatch({ type: TimerActions.TICK });
        }
      }, 100);

      if (
        state.timer === 30 &&
        state.activeStatus === TimerActiveStatus.COUNTDOWN
      ) {
        const audio = new Audio('/sounds/countdown.mp3');
        audio.play();
      }

      return () => clearInterval(interval);
    } else if (state.activeStatus === TimerActiveStatus.COUNTDOWN) {
      const audio = new Audio('/sounds/start.mp3');
      audio.play();
      dispatch({
        type: TimerActions.UPDATE,
        timer: props.repDuration * 10,
        activeStatus: TimerActiveStatus.WORK
      });
    } else if (state.activeStatus === TimerActiveStatus.REST) {
      let updateRep = state.currentRep;
      let updateSet = state.currentSet;
      if (updateRep < props.reps) {
        updateRep++;
      } else if (updateRep === props.reps) {
        updateRep = 1;
        if (updateSet < props.sets) {
          updateSet++;
        }
      }
      const audio = new Audio('/sounds/start.mp3');
      audio.play();
      dispatch({
        type: TimerActions.UPDATE,
        timer: props.repDuration * 10,
        activeStatus: TimerActiveStatus.WORK,
        currentRep: updateRep,
        currentSet: updateSet
      });
    } else if (state.activeStatus === TimerActiveStatus.WORK) {
      if (state.currentRep < props.reps) {
        const audio = new Audio('/sounds/rep_complete.mp3');
        audio.play();
        dispatch({
          type: TimerActions.UPDATE,
          timer: props.repsRest * 10,
          activeStatus: TimerActiveStatus.REST
        });
      } else if (
        state.currentRep === props.reps &&
        state.currentSet < props.sets
      ) {
        const audio = new Audio('/sounds/set_complete.mp3');
        audio.play();
        dispatch({
          type: TimerActions.UPDATE,
          timer: props.setsRest * 10,
          activeStatus: TimerActiveStatus.REST
        });
      } else {
        const audio = new Audio('/sounds/set_complete.mp3');
        audio.play();
        dispatch({
          type: TimerActions.FINISH
        });
      }
    }
  }, [state, props]);

  console.log(props, state.currentSet);

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setIsOpen(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>{props.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="h-full w-full p-2">
          <div
            className={`m-6 flex flex-col content-center items-center justify-center ${getColour(
              state.activeStatus,
              state.timerState
            )}`}
          >
            <span className="text-4xl">
              <span>
                {state.timerState === TimerState.UNSTARTED
                  ? minsFromDs(props.repDuration * 10)
                  : minsFromDs(state.timer)}
              </span>
              <span>:</span>
              <span>
                {state.timerState === TimerState.UNSTARTED
                  ? secsFromDs(props.repDuration * 10)
                  : secsFromDs(state.timer)}
              </span>
              <span className="text-sm">
                {state.timerState === TimerState.UNSTARTED
                  ? '0'
                  : decisRemaining(state.timer)}
              </span>
            </span>
            <span>
              {renderInstruction(state.activeStatus, state.timerState)}
            </span>
          </div>
          <div className="center-items flex flex-row justify-between">
            <span className="m-2 flex flex-row items-center rounded bg-slate-200 p-2 text-slate-900">
              <p className="text-sm">Rep: </p>
              {state.currentRep} / {props.reps}
            </span>
            {props.setTitles && (
              <span className="m-2 flex flex-row items-center text-lg">
                <p>{props.setTitles[state.currentSet - 1]}</p>
              </span>
            )}
            <span className="m-2 flex flex-row items-center rounded bg-slate-200 p-2 text-slate-900">
              <p className="text-sm">Set: </p>
              {state.currentSet} / {props.sets}
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="m-2 flex flex-col items-center rounded bg-slate-100 p-2 text-xs text-slate-800">
              <p>Work</p>
              {formatTime(props.repDuration)}
            </span>
            <span className="m-2 flex flex-col items-center rounded bg-slate-100 p-2 text-xs text-slate-800">
              <p>Rep Rest</p>
              {formatTime(props.repsRest)}
            </span>
            <span className="m-2 flex flex-col items-center rounded bg-slate-100 p-2 text-xs text-slate-800">
              <p>Set Rest</p>
              {formatTime(props.setsRest)}
            </span>
          </div>
          <div className="m-2 flex flex-row justify-between">
            <button onClick={() => dispatch({ type: 'PREV_SET' })}>
              <IonIcon icon={playSkipBack} />
            </button>
            <button onClick={() => dispatch({ type: 'PREV_REP' })}>
              <IonIcon icon={playBack} />
            </button>
            <button onClick={() => dispatch({ type: 'NEXT_REP' })}>
              <IonIcon icon={playForward} />
            </button>
            <button onClick={() => dispatch({ type: 'NEXT_SET' })}>
              <IonIcon icon={playSkipForward} />
            </button>
          </div>
          <div className="m-2 flex flex-row justify-between space-x-2">
            <button
              className="w-1/2 rounded-xl bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
              onClick={handlePlayPause}
            >
              {state.timerState === TimerState.PLAYING ? (
                <IonIcon icon={pause} />
              ) : (
                <IonIcon icon={play} />
              )}
            </button>
            <button
              className="w-1/2 rounded-xl bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={() =>
                dispatch({ type: TimerActions.RESET, payload: initialProps })
              }
            >
              <IonIcon icon={refresh} />
            </button>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default TimerModal;
