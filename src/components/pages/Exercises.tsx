import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import React, { useState } from 'react';
import CreateExerciseModal from './CreateExerciseModal';
import Card from '../ui/Card';
import type { ExerciseProps, ExerciseEntryProps } from '@/types/exercise';
import { Link } from 'react-router-dom';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonButton,
  IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import type { FunctionComponent } from 'react';

const ExerciseEntry: FunctionComponent<ExerciseEntryProps> = (props) => (
  <Link to={`/tabs/exercises/${props.exercise.id}`}>
    <Card className="my-4 mx-auto">
      <h1>{props.exercise.title}</h1>
      <p>{props.exercise.summary}</p>
      <p>{props.exercise.author.name}</p>
    </Card>
  </Link>
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
  const exercises = trpc.exercise.getAll.useQuery();

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
