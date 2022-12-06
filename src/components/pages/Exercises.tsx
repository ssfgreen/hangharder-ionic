import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import React, { useEffect, useState } from 'react';
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
  IonIcon,
  IonSearchbar,
  IonChip
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
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterFavourites, setFilterFavourites] = useState(false);
  const { data: exercises } = trpc.exercise.getAll.useQuery();

  useEffect(() => {
    if (filterFavourites) {
      setResults(
        exercises.filter(
          (exercise) =>
            exercise.favourited &&
            exercise.title.toLowerCase().indexOf(searchText) > -1
        )
      );
    } else if (searchText.length > 0) {
      setResults(
        exercises.filter((d) => d.title.toLowerCase().indexOf(searchText) > -1)
      );
    } else {
      setResults(exercises);
    }
  }, [filterFavourites, searchText, exercises]);

  const insertMutation = trpc.exercise.insertOne.useMutation({
    onSuccess: () => {
      exercises.refetch();
    },
    onError: (data) => {
      console.log(data.message);
    }
  });

  const handleChange = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();
    setSearchText(query);
  };

  const handleFilterFavourites = () => {
    console.log('filter favourites');
    setFilterFavourites(!filterFavourites);
  };

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
        <IonSearchbar
          debounce={1000}
          onIonChange={(ev) => handleChange(ev)}
        ></IonSearchbar>
        <IonChip
          onClick={handleFilterFavourites}
          color={filterFavourites ? 'primary' : 'dark'}
        >
          Favourites
        </IonChip>
        {results && <AllExercises exercises={results} />}
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
