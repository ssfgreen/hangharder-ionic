import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import React from 'react';
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
import type { FunctionComponent } from 'react';
import type { LogEntryProps } from '@/types/log';

const LogEntry: FunctionComponent<LogEntryProps> = (props) => (
  <IonItem>
    <IonLabel>
      <h1>{props.log.exercise.title}</h1>
      {/* <p>{props.log.createdAt}</p> */}
      <p>Created At: {moment(props.log.createdAt).format()}</p>
      <p>{props.log.comment}</p>
    </IonLabel>
  </IonItem>
);

const AllLogs = () => {
  const { data: session } = useSession();
  const { data: logs } = trpc.log.getMyLogs.useQuery({
    userId: session?.user?.id as string
  });

  return (
    <>
      {!logs ? (
        <IonSpinner></IonSpinner>
      ) : (
        logs.map((log, i) => <LogEntry key={i} log={log} />)
      )}
    </>
  );
};

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
