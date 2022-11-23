import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

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
        <h1>{user && user.name}</h1>
      </IonContent>
    </IonPage>
  );
};

export default Logbook;
