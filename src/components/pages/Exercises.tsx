import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import React, { useState } from 'react';
import CreateExerciseModal from './CreateExerciseModal';
import type { ExerciseProps, ExerciseEntryProps } from '@/types/exercise';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonButton,
  IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import type { FunctionComponent } from 'react';

const ExerciseEntry: FunctionComponent<ExerciseEntryProps> = (props) => (
  <IonItem
    routerLink={`/tabs/exercises/${props.exercise.id}`}
    className="exercise-entry"
  >
    <IonLabel>
      <h1>{props.exercise.title}</h1>
      <p>{props.exercise.summary}</p>
      <p>{props.exercise.author.name}</p>
    </IonLabel>
  </IonItem>
);

const AllExercises: NextPage<ExerciseProps> = ({ exercises }) => {
  return (
    <>
      {!exercises ? (
        <IonSpinner></IonSpinner>
      ) : (
        exercises.map((exercise, i) => (
          <ExerciseEntry key={i} exercise={exercise} />
        ))
      )}
    </>
  );
};

const Exercises: NextPage = () => {
  const [createExerciseModalOpen, setCreateExerciseModalOpen] = useState(false);
  const exercises = trpc.exercise.getAllMinimial.useQuery();
  const insertMutation = trpc.exercise.insertOne.useMutation({
    onSuccess: () => {
      exercises.refetch();
    },
    onError: (data) => {
      console.log(data.message);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Exercises</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() =>
                setCreateExerciseModalOpen(!createExerciseModalOpen)
              }
            >
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-blue dark:bg-red">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Exercises</IonTitle>
          </IonToolbar>
        </IonHeader>
        {exercises.data && <AllExercises exercises={exercises.data} />}
      </IonContent>
      <CreateExerciseModal
        isOpen={createExerciseModalOpen}
        setIsOpen={setCreateExerciseModalOpen}
        mutation={insertMutation}
      />
    </IonPage>
  );
};

export default Exercises;
