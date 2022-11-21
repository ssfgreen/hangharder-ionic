import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Timer from './Timer';
import Log from './Log';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLoading,
  IonBackButton,
  IonButtons
} from '@ionic/react';

const Exercise = ({ match }: { match: { params: { exerciseId: string } } }) => {
  const {
    params: { exerciseId }
  } = match;

  const { data: exercise } = trpc.exercise.getById.useQuery(exerciseId);

  const timerKeys = ['repDuration', 'reps', 'sets', 'repsRest', 'setsRest'];
  const timerAvailable =
    exercise && timerKeys.every((key) => exercise[key] !== null);

  return !exercise ? (
    // <IonLoading isOpen={true}></IonLoading>
    <div>Loading...</div>
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
        <div className="m-2 rounded border bg-neutral-800 p-2">
          <div className="m-1 space-y-1">
            <header className="flex flex-row items-center space-x-2">
              <h1 className="text-xl">{exercise.title}</h1>
              <span className="text-xs">by {exercise.author.name}</span>
            </header>
            <p>{exercise.summary}</p>
          </div>
          {timerAvailable && (
            <Timer
              repDuration={exercise.repDuration as number}
              reps={exercise.reps as number}
              sets={exercise.sets as number}
              repsRest={exercise.repsRest as number}
              setsRest={exercise.setsRest as number}
            ></Timer>
          )}
          <div className="flex justify-center">
            <Log id={exerciseId} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Exercise;
