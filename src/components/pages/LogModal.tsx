import type { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import { close } from 'ionicons/icons';

interface LogProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LogModal: NextPage<LogProps> = (props) => {
  const { data: session } = useSession();
  const mutation = trpc.log.insertOne.useMutation();

  const handleLog = async () => {
    session?.user?.id &&
      mutation.mutate({
        exerciseId: props.id,
        userId: session.user.id,
        comment: 'I did it!'
      });
  };

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setIsOpen(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Log</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <button className="m-2 rounded bg-blue-400 p-2" onClick={handleLog}>
          Log Exercise
        </button>
        {mutation.error && (
          <p className="text-red">
            Something went wrong! {mutation.error.message}
          </p>
        )}
      </IonContent>
    </IonModal>
  );
};

export default LogModal;
