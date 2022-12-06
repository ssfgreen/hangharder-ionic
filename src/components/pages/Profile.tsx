import type { NextPage } from 'next';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import AllLogs from '../ui/AllLogs';
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

const Profile: NextPage = () => {
  const { data: session } = useSession();
  const { data: user, isLoading } = trpc.user.getById.useQuery({
    id: session?.user?.id as string
  });

  if (isLoading) {
    return <IonSpinner></IonSpinner>;
  }

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
        <section className="flex h-full w-full flex-col items-center overflow-auto">
          {user && user.image && (
            <div className="h-20 w-20 rounded-full">
              <Image
                className="mb-2 rounded-full"
                src={user.image}
                alt="logo"
                width={100}
                height={100}
              ></Image>
            </div>
          )}
          <h1 className="mb-2 text-xl">{user && user.name}</h1>
          {user && user.description && <p>{user.description}</p>}
          <p>{user && user.authoredExercises.length} Exercises Authored</p>
          <p>{user && user.loggedExercises.length} Workouts Authored</p>
          <section className="flex flex-row">
            <div>Logbook</div>
            <div>Collections</div>
          </section>
          <section>
            <AllLogs />
          </section>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
