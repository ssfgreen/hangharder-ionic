import type { NextPage } from 'next';
import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';
import TimerModal from './TimerModal';
import LogModal from './LogModal';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSpinner
} from '@ionic/react';

const Exercise = ({ match }: { match: { params: { exerciseId: string } } }) => {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);

  const {
    params: { exerciseId }
  } = match;

  const { data: exercise } = trpc.exercise.getById.useQuery(exerciseId);

  const timerKeys = ['repDuration', 'reps', 'sets', 'repsRest', 'setsRest'];
  const timerAvailable =
    exercise && timerKeys.every((key) => exercise[key] !== null);

  return !exercise ? (
    <IonSpinner></IonSpinner>
  ) : (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/exercises" />
          </IonButtons>
          <IonTitle>{exercise.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollEvents overflow-scroll="false">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{exercise.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="h-full w-full border bg-neutral-800 p-2 text-white">
          <div className="m-1 space-y-1">
            <header className="flex flex-row items-center space-x-2">
              <h1 className="text-xl">{exercise.title}</h1>
              <span className="text-xs">by {exercise.author.name}</span>
            </header>
            <p>{exercise.summary}</p>
          </div>
          {timerAvailable && (
            <TimerModal
              title={exercise.title}
              isOpen={timerModalOpen}
              setIsOpen={setTimerModalOpen}
              repDuration={exercise.repDuration as number}
              reps={exercise.reps as number}
              sets={exercise.sets as number}
              repsRest={exercise.repsRest as number}
              setsRest={exercise.setsRest as number}
            ></TimerModal>
          )}
          <button onClick={() => setTimerModalOpen(!timerModalOpen)}>
            Start Activity
          </button>
          <button onClick={() => setLogModalOpen(!logModalOpen)}>
            Log Workout
          </button>
          <LogModal
            id={exerciseId}
            isOpen={logModalOpen}
            setIsOpen={setLogModalOpen}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Exercise;
