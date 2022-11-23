import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
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
  IonSpinner,
  IonIcon
} from '@ionic/react';
import {
  clipboardOutline,
  starOutline,
  stopwatchOutline
} from 'ionicons/icons';

const Exercise = ({ match }: { match: { params: { exerciseId: string } } }) => {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);

  const {
    params: { exerciseId }
  } = match;

  const { data: exercise } = trpc.exercise.getById.useQuery(exerciseId);

  console.log(exercise);

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
          <button onClick={() => setTimerModalOpen(!timerModalOpen)}>
            <IonIcon icon={stopwatchOutline} />
            Start Workout
          </button>
          <button onClick={() => setLogModalOpen(!logModalOpen)}>
            <IonIcon icon={clipboardOutline} />
            Log Workout
          </button>
          <button onClick={() => console.log('fav')}>
            <IonIcon icon={starOutline} />
            Favorite
          </button>
          EXERCISE OVERVIEW
        </div>
        <LogModal
          id={exerciseId}
          isOpen={logModalOpen}
          setIsOpen={setLogModalOpen}
        />
        {exercise.workouts[0] && (
          <TimerModal
            title={exercise.title}
            isOpen={timerModalOpen}
            setIsOpen={setTimerModalOpen}
            repDuration={exercise.workouts[0].repDuration as number}
            reps={exercise.workouts[0].reps as number}
            sets={exercise.workouts[0].sets as number}
            repsRest={exercise.workouts[0].repsRest as number}
            setsRest={exercise.workouts[0].setsRest as number}
          ></TimerModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Exercise;
