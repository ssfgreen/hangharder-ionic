import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Exercise from './Exercise';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  useIonLoading
} from '@ionic/react';
import { useEffect } from 'react';

const ExerciseEntry = (props: { id: string }) => (
  <IonItem
    routerLink={`/tabs/exercises/${props.id}`}
    className="exercise-entry"
  >
    <IonLabel>{props.id}</IonLabel>
  </IonItem>
);

const AllExercises = () => {
  const [present, dismiss] = useIonLoading();
  const { data: exerciseIds, isLoading } = trpc.exercise.getIds.useQuery();

  // useEffect(() => {
  //   console.log('ids', exerciseIds);
  //   if (!exerciseIds) {
  //     console.log('running present');
  //     present({ backdropDismiss: true });
  //   }
  //   return () => {
  //     console.log('running dismiss in cleanup');
  //     dismiss();
  //   };
  // }, [exerciseIds, present, dismiss]);

  return (
    <>
      {!exerciseIds ? (
        <div>Loading... </div>
      ) : (
        exerciseIds.map((exercise, i) => (
          <ExerciseEntry key={i} id={exercise.id} />
        ))
      )}
    </>
  );
};

const Exercises: NextPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Exercises</IonTitle>
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
    </IonPage>
  );
};

export default Exercises;
