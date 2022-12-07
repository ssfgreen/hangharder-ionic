import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import TimerModal from '../TimerModal';
import LogModal from '../../pages/LogModal';
import moment from 'moment';

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
import { clipboardOutline, stopwatchOutline } from 'ionicons/icons';
import Favorite from '../Favourite';

const MyLogs = ({ exerciseId }: { exerciseId: string }) => {
  const { data: logs } = trpc.log.getMyLogsByExercise.useQuery(exerciseId);

  if (logs?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <IonIcon icon={clipboardOutline} className="text-2xl" />
        <h1 className="text-lg">No logs yet</h1>
      </div>
    );
  }

  return (
    <>
      {!logs ? (
        <IonSpinner></IonSpinner>
      ) : (
        logs.map((log, i) => {
          return (
            <div key={i} className="ml-2 flex flex-col border-b py-2">
              <p className="text-sm">
                {moment(log.createdAt).calendar(null, {
                  sameElse: 'MMMM Do YYYY, h:mm A'
                })}
              </p>
              <div>
                {log.weight && (
                  <>
                    <span className="text-xs">
                      {log.weight > 0 ? '+' : '-'}
                      {log.weight} kg
                    </span>
                  </>
                )}
                {log.weight && log.completePerc && <span> · </span>}
                {log.completePerc && (
                  <>
                    <span className="text-xs">
                      {log.completePerc}% Complete
                    </span>
                  </>
                )}
              </div>
              {log.comment && <p>{log.comment}</p>}
            </div>
          );
        })
      )}
    </>
  );
};

const Exercise = ({ match }: { match: { params: { exerciseId: string } } }) => {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);

  const {
    params: { exerciseId }
  } = match;

  const { data: exercise } = trpc.exercise.getById.useQuery(exerciseId);

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
        <div className="h-full w-full space-y-2 overflow-auto border p-2">
          <div className="m-1 space-y-1">
            <header className="flex flex-row items-center space-x-2">
              <h1 className="text-xl">{exercise.title}</h1>
              <span className="text-xs">by {exercise.author.name}</span>
            </header>
            <p>{exercise.summary}</p>
          </div>
          <div className="flex flex-row justify-between">
            <button
              className="flex h-16 flex-col items-center justify-center rounded-md border p-2"
              onClick={() => setTimerModalOpen(!timerModalOpen)}
            >
              <IonIcon icon={stopwatchOutline} />
              Start Workout
            </button>
            <button
              className="flex h-16 flex-col items-center justify-center rounded-md border p-2"
              onClick={() => setLogModalOpen(!logModalOpen)}
            >
              <IonIcon icon={clipboardOutline} />
              Log Workout
            </button>
            <Favorite
              exerciseId={exercise.id}
              favourited={exercise.favourited}
            />
          </div>
          {exercise.description && (
            <>
              <h2 className="text-lg">Description</h2>
              <p>{exercise.description}</p>
            </>
          )}
          <div>
            <h2 className="text-lg">My Logs</h2>
            <MyLogs exerciseId={exerciseId} />
          </div>
        </div>
        <LogModal
          id={exerciseId}
          isOpen={logModalOpen}
          setIsOpen={setLogModalOpen}
        />
        {exercise.workout && (
          <TimerModal
            title={exercise.title}
            isOpen={timerModalOpen}
            setLogModalOpen={setLogModalOpen}
            setIsOpen={setTimerModalOpen}
            repDuration={exercise.workout.repDuration as number}
            setTitles={exercise.workout.setTitles as string[]}
            reps={exercise.workout.reps as number}
            sets={exercise.workout.sets as number}
            repsRest={exercise.workout.repsRest as number}
            setsRest={exercise.workout.setsRest as number}
          ></TimerModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Exercise;
