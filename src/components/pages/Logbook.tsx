import type { NextPage } from 'next';
import React from 'react';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton
} from '@ionic/react';

import AllLogs from '../ui/AllLogs';

const Logbook: NextPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>LogBook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">LogBook</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllLogs />
      </IonContent>
    </IonPage>
  );
};

export default Logbook;
