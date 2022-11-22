import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Exercise from './Exercise';
import React, { useState } from 'react';
import CreateExerciseModal from './CreateExerciseModal';

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
import { useEffect } from 'react';

const ExerciseEntry = (props) => (
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

const AllExercises = () => {
  const { data: exercises } = trpc.exercise.getAllMinimial.useQuery();
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
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Exercises</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllExercises />
      </IonContent>
      <CreateExerciseModal
        isOpen={createExerciseModalOpen}
        setIsOpen={setCreateExerciseModalOpen}
      />
    </IonPage>
  );
};

export default Exercises;
