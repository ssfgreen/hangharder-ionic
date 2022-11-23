import type { NextPage } from 'next';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import React from 'react';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSpinner
} from '@ionic/react';

const Logbook: NextPage = () => {
  const { data: session } = useSession();
  const { data: user, isLoading } = trpc.user.getById.useQuery({
    id: session?.user?.id as string
  });

  if (isLoading) {
    return <IonSpinner></IonSpinner>;
  }

  console.log(user);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <section className="flex h-full w-full flex-col items-center justify-center">
          {user && user.image && (
            <Image
              className="mb-2 rounded-full"
              src={user.image}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          )}
          <h1 className="mb-2 text-xl">{user && user.name}</h1>
          <p>{user && user.authoredExercises.length} Exercises Authored</p>
          <p>{user && user.loggedExercises.length} Workouts Authored</p>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Logbook;
