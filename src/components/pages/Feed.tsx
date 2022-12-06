import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import React from 'react';
import moment from 'moment';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import type { User } from '@prisma/client';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonIcon
} from '@ionic/react';
import Card from '../ui/Card';
import { thumbsUpOutline, playOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import type { LogEntryProps } from '@/types/log';

const FeedEntry: FunctionComponent<LogEntryProps> = (props) => {
  const handleLike = async () => {
    props.mutation.mutate(props.log.id);
  };

  return (
    <Card className="my-4 mx-auto">
      <section className="mb-2 flex flex-row">
        {props.log.user && props.log.user.image && (
          <div className="mr-4 h-10 w-10 overflow-hidden rounded-full">
            <Image
              className="mb-2 rounded-full"
              src={props.log.user.image}
              alt="profileImage"
              width={40}
              height={40}
            ></Image>
          </div>
        )}
        <div className="ml-2 flex flex-col">
          <h1 className="text">{props.log.user && props.log.user.name}</h1>
          <p className="text-xs">
            {moment(props.log.createdAt).calendar(null, {
              sameElse: 'MMMM Do YYYY, h:mm A'
            })}
          </p>
        </div>
      </section>
      <h1>
        <b>{props.log.exercise.title}</b>
      </h1>
      <p className="text-sm">{props.log.comment}</p>
      <section className="mb-2 flex flex-row justify-between border-b py-4">
        {props.log.weight && (
          <div className="flex flex-col">
            <p className="text-xs text-slate-600">Added Weight</p>
            <p className="text-xl">
              {props.log.weight > 0 ? '+' : '-'}
              {props.log.weight} kg
            </p>
          </div>
        )}
      </section>
      <section className="flex flex-row justify-between">
        <button onClick={handleLike} className="w-full p-2">
          <IonIcon icon={thumbsUpOutline}></IonIcon>{' '}
          {props.log?.likedBy && props.log.likedBy.length > 0
            ? props.log.likedBy.length
            : ''}
        </button>
        <Link
          className="flex w-full items-center justify-center p-2"
          to={`/tabs/exercises/${props.log.exercise.id}`}
        >
          <IonIcon icon={playOutline}></IonIcon>
        </Link>
      </section>
    </Card>
  );
};

const AllPosts = () => {
  const { data: logs } = trpc.log.getAll.useQuery(); // replace with log.getMyFeed which gets friends etc
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const mutation = trpc.log.likeLog.useMutation({
    onMutate: async (logId) => {
      // cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.log.getAll.invalidate();

      // create optimistic update
      const previousLogs = logs;
      const optimisticUpdate = previousLogs?.map((log) => {
        if (log.id === logId) {
          if (
            log?.likedBy?.length > 0 &&
            log.likedBy.filter((user) => user.id === session?.user?.id).length >
              0
          ) {
            const removedUserLog = {
              ...log,
              likedBy: log.likedBy.filter(
                (user) => user.id !== session?.user?.id
              )
            };
            return removedUserLog;
          } else {
            return {
              ...log,
              likedBy: [
                ...(log.likedBy || []),
                {
                  id: session?.user?.id,
                  name: session?.user?.name
                } as User // not sure if this is allowed?
              ]
            };
          }
        }
        return log;
      });

      // update the cache
      utils.log.getAll.setData(optimisticUpdate);

      // return a context object with the snapshotted value
      return { optimisticUpdate };
    },
    onSuccess: async (data) => {
      utils.log.getAll.setData((prev) => {
        return prev?.map((log) => {
          if (log.id === data.id) {
            return { ...log, likedBy: data.likedBy };
          }
          return log;
        });
      });
    },
    onError: (err) => {
      console.log('err', err);
    }
  });

  return (
    <>
      {!logs ? (
        <IonSpinner></IonSpinner>
      ) : (
        logs.map((log, i) => {
          return <FeedEntry key={i} log={log} mutation={mutation} />;
        })
      )}
    </>
  );
};

const Feed: NextPage = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllPosts />
      </IonContent>
    </IonPage>
  );
};

export default Feed;
