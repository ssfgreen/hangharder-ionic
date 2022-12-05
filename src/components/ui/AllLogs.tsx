import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import React from 'react';
import moment from 'moment';

import { IonItem, IonLabel, IonSpinner } from '@ionic/react';
import Card from '../ui/Card';
import type { FunctionComponent } from 'react';
import type { LogEntryProps } from '@/types/log';

const LogEntry: FunctionComponent<LogEntryProps> = (props) => (
  <Card className="my-4 mx-auto">
    <h1>{props.log.exercise.title}</h1>
    <p>Created At: {moment(props.log.createdAt).format()}</p>
    <p>{props.log.comment}</p>
  </Card>
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

export default AllLogs;
